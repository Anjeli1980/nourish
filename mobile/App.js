import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { BACKEND_URL } from './config';

const Tab = createBottomTabNavigator();

// Icons (using emojis for simplicity)
const TabBarIcon = ({ focused, emoji }) => (
  <Text style={{ fontSize: focused ? 28 : 24 }}>{emoji}</Text>
);

// ==================== DASHBOARD SCREEN ====================
function DashboardScreen({ userId }) {
  const [stats, setStats] = useState(null);
  const [dailySummary, setDailySummary] = useState(null);
  const [waterIntake, setWaterIntake] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];
      
      const [statsRes, summaryRes, waterRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/profile/${userId}/stats`),
        axios.get(`${BACKEND_URL}/meals/${userId}/${today}/summary`),
        axios.get(`${BACKEND_URL}/water/${userId}/${today}`)
      ]);
      
      setStats(statsRes.data);
      setDailySummary(summaryRes.data);
      setWaterIntake(waterRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchData();
  }, [userId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!stats) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>No profile data. Please create a profile first!</Text>
      </View>
    );
  }

  const caloriesConsumed = dailySummary?.total_calories || 0;
  const caloriesRemaining = stats.target_calories - caloriesConsumed;
  const caloriesPercentage = Math.min((caloriesConsumed / stats.target_calories) * 100, 100);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📊 Dashboard</Text>
        <TouchableOpacity onPress={fetchData} style={styles.refreshButton}>
          <Text style={styles.refreshButtonText}>🔄 Refresh</Text>
        </TouchableOpacity>
      </View>

      {/* Calorie Progress */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Today's Calories</Text>
        <View style={styles.calorieStats}>
          <View style={styles.calorieItem}>
            <Text style={styles.calorieLabel}>Goal</Text>
            <Text style={styles.calorieValue}>{Math.round(stats.target_calories)}</Text>
          </View>
          <View style={styles.calorieItem}>
            <Text style={styles.calorieLabel}>Consumed</Text>
            <Text style={[styles.calorieValue, { color: '#007AFF' }]}>{Math.round(caloriesConsumed)}</Text>
          </View>
          <View style={styles.calorieItem}>
            <Text style={styles.calorieLabel}>Remaining</Text>
            <Text style={[styles.calorieValue, { color: caloriesRemaining >= 0 ? '#4CAF50' : '#F44336' }]}>
              {Math.round(caloriesRemaining)}
            </Text>
          </View>
        </View>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${caloriesPercentage}%` }]} />
        </View>
      </View>

      {/* Macros */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Macronutrients</Text>
        <View style={styles.macroGrid}>
          <View style={styles.macroItem}>
            <Text style={styles.macroEmoji}>🥩</Text>
            <Text style={styles.macroLabel}>Protein</Text>
            <Text style={styles.macroValue}>{Math.round(dailySummary?.total_protein || 0)}g</Text>
          </View>
          <View style={styles.macroItem}>
            <Text style={styles.macroEmoji}>🍞</Text>
            <Text style={styles.macroLabel}>Carbs</Text>
            <Text style={styles.macroValue}>{Math.round(dailySummary?.total_carbs || 0)}g</Text>
          </View>
          <View style={styles.macroItem}>
            <Text style={styles.macroEmoji}>🥑</Text>
            <Text style={styles.macroLabel}>Fats</Text>
            <Text style={styles.macroValue}>{Math.round(dailySummary?.total_fats || 0)}g</Text>
          </View>
        </View>
      </View>

      {/* Water Intake */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>💧 Water Intake</Text>
        <Text style={styles.waterText}>
          {waterIntake?.total_ml || 0}ml / 2000ml ({waterIntake?.percentage || 0}%)
        </Text>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${Math.min(waterIntake?.percentage || 0, 100)}%`, backgroundColor: '#2196F3' }]} />
        </View>
      </View>

      {/* Stats */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Your Stats</Text>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>BMI:</Text>
          <Text style={styles.statValue}>{stats.bmi}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>BMR:</Text>
          <Text style={styles.statValue}>{Math.round(stats.bmr)} cal/day</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>TDEE:</Text>
          <Text style={styles.statValue}>{Math.round(stats.tdee)} cal/day</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Current Weight:</Text>
          <Text style={styles.statValue}>{stats.current_weight} kg</Text>
        </View>
        {stats.target_weight && (
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Target Weight:</Text>
            <Text style={styles.statValue}>{stats.target_weight} kg</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

// ==================== MEALS SCREEN ====================
function MealsScreen({ userId }) {
  const [mealType, setMealType] = useState('breakfast');
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');
  const [servingSize, setServingSize] = useState('1 serving');
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const fetchMeals = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/meals/${userId}/${today}`);
      setMeals(response.data);
    } catch (error) {
      console.error('Error fetching meals:', error);
    }
  };

  useEffect(() => {
    if (userId) fetchMeals();
  }, [userId]);

  const addMeal = async () => {
    if (!foodName || !calories) {
      Alert.alert('Error', 'Please enter food name and calories');
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${BACKEND_URL}/meals`, {
        user_id: userId,
        meal_type: mealType,
        food_name: foodName,
        calories: parseFloat(calories),
        protein: parseFloat(protein) || 0,
        carbs: parseFloat(carbs) || 0,
        fats: parseFloat(fats) || 0,
        serving_size: servingSize,
        date: today
      });

      Alert.alert('Success', 'Meal logged!');
      setFoodName('');
      setCalories('');
      setProtein('');
      setCarbs('');
      setFats('');
      setServingSize('1 serving');
      fetchMeals();
    } catch (error) {
      Alert.alert('Error', 'Failed to log meal');
    } finally {
      setLoading(false);
    }
  };

  const deleteMeal = async (mealId) => {
    try {
      await axios.delete(`${BACKEND_URL}/meals/${mealId}`);
      fetchMeals();
    } catch (error) {
      Alert.alert('Error', 'Failed to delete meal');
    }
  };

  const mealsByType = {
    breakfast: meals.filter(m => m.meal_type === 'breakfast'),
    lunch: meals.filter(m => m.meal_type === 'lunch'),
    dinner: meals.filter(m => m.meal_type === 'dinner'),
    snack: meals.filter(m => m.meal_type === 'snack')
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.screenTitle}>🍽️ Log Meal</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Meal Type</Text>
        <View style={styles.mealTypeButtons}>
          {['breakfast', 'lunch', 'dinner', 'snack'].map(type => (
            <TouchableOpacity
              key={type}
              style={[styles.mealTypeButton, mealType === type && styles.mealTypeButtonActive]}
              onPress={() => setMealType(type)}
            >
              <Text style={[styles.mealTypeText, mealType === type && styles.mealTypeTextActive]}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          style={styles.input}
          placeholder="Food name"
          value={foodName}
          onChangeText={setFoodName}
        />

        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, styles.inputHalf]}
            placeholder="Calories"
            value={calories}
            onChangeText={setCalories}
            keyboardType="numeric"
          />
          <TextInput
            style={[styles.input, styles.inputHalf]}
            placeholder="Serving size"
            value={servingSize}
            onChangeText={setServingSize}
          />
        </View>

        <Text style={styles.sectionLabel}>Macros (optional)</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, styles.inputThird]}
            placeholder="Protein (g)"
            value={protein}
            onChangeText={setProtein}
            keyboardType="numeric"
          />
          <TextInput
            style={[styles.input, styles.inputThird]}
            placeholder="Carbs (g)"
            value={carbs}
            onChangeText={setCarbs}
            keyboardType="numeric"
          />
          <TextInput
            style={[styles.input, styles.inputThird]}
            placeholder="Fats (g)"
            value={fats}
            onChangeText={setFats}
            keyboardType="numeric"
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={addMeal} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>✓ Log Meal</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Today's Meals */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Today's Meals</Text>
        
        {Object.entries(mealsByType).map(([type, typeMeals]) => (
          typeMeals.length > 0 && (
            <View key={type} style={styles.mealSection}>
              <Text style={styles.mealSectionTitle}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
              {typeMeals.map(meal => (
                <View key={meal.id} style={styles.mealItem}>
                  <View style={styles.mealItemInfo}>
                    <Text style={styles.mealItemName}>{meal.food_name}</Text>
                    <Text style={styles.mealItemDetails}>
                      {meal.calories} cal • {meal.serving_size}
                    </Text>
                    {(meal.protein > 0 || meal.carbs > 0 || meal.fats > 0) && (
                      <Text style={styles.mealItemMacros}>
                        P: {meal.protein}g • C: {meal.carbs}g • F: {meal.fats}g
                      </Text>
                    )}
                  </View>
                  <TouchableOpacity onPress={() => deleteMeal(meal.id)}>
                    <Text style={styles.deleteButton}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )
        ))}

        {meals.length === 0 && (
          <Text style={styles.emptyText}>No meals logged today. Add one above!</Text>
        )}
      </View>
    </ScrollView>
  );
}

// ==================== WATER SCREEN ====================
function WaterScreen({ userId }) {
  const [waterIntake, setWaterIntake] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const today = new Date().toISOString().split('T')[0];

  const fetchWater = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/water/${userId}/${today}`);
      setWaterIntake(response.data);
    } catch (error) {
      console.error('Error fetching water data:', error);
    }
  };

  useEffect(() => {
    if (userId) fetchWater();
  }, [userId]);

  const logWater = async (amount) => {
    try {
      await axios.post(`${BACKEND_URL}/water`, {
        user_id: userId,
        amount_ml: amount,
        date: today
      });
      fetchWater();
      setCustomAmount('');
    } catch (error) {
      Alert.alert('Error', 'Failed to log water');
    }
  };

  const quickAmounts = [250, 500, 750, 1000];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.screenTitle}>💧 Water Tracker</Text>

      <View style={styles.card}>
        <Text style={styles.waterLargeText}>
          {waterIntake?.total_ml || 0} ml
        </Text>
        <Text style={styles.waterSubText}>
          of 2000 ml daily goal ({waterIntake?.percentage || 0}%)
        </Text>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { 
            width: `${Math.min(waterIntake?.percentage || 0, 100)}%`,
            backgroundColor: '#2196F3'
          }]} />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Quick Add</Text>
        <View style={styles.waterButtonGrid}>
          {quickAmounts.map(amount => (
            <TouchableOpacity
              key={amount}
              style={styles.waterButton}
              onPress={() => logWater(amount)}
            >
              <Text style={styles.waterButtonEmoji}>💧</Text>
              <Text style={styles.waterButtonText}>{amount}ml</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionLabel}>Custom Amount</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Amount in ml"
            value={customAmount}
            onChangeText={setCustomAmount}
            keyboardType="numeric"
          />
          <TouchableOpacity
            style={[styles.button, { marginLeft: 8, flex: 0, paddingHorizontal: 20 }]}
            onPress={() => customAmount && logWater(parseFloat(customAmount))}
          >
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

// ==================== PROFILE SCREEN ====================
function ProfileScreen({ userId, setUserId }) {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('moderate');
  const [goal, setGoal] = useState('maintain');
  const [targetWeight, setTargetWeight] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchProfile = async () => {
    if (!userId) return;
    try {
      const response = await axios.get(`${BACKEND_URL}/profile/${userId}`);
      setProfile(response.data);
      setName(response.data.name);
      setAge(response.data.age.toString());
      setGender(response.data.gender);
      setHeight(response.data.height.toString());
      setWeight(response.data.weight.toString());
      setActivityLevel(response.data.activity_level);
      setGoal(response.data.goal);
      setTargetWeight(response.data.target_weight?.toString() || '');
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const createProfile = async () => {
    if (!name || !age || !height || !weight) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${BACKEND_URL}/profile`, {
        name,
        age: parseInt(age),
        gender,
        height: parseFloat(height),
        weight: parseFloat(weight),
        activity_level: activityLevel,
        goal,
        target_weight: targetWeight ? parseFloat(targetWeight) : null
      });
      setUserId(response.data.id);
      setProfile(response.data);
      setIsEditing(false);
      Alert.alert('Success', 'Profile created!');
    } catch (error) {
      Alert.alert('Error', 'Failed to create profile');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    try {
      setLoading(true);
      await axios.put(`${BACKEND_URL}/profile/${userId}`, {
        name,
        age: parseInt(age),
        gender,
        height: parseFloat(height),
        weight: parseFloat(weight),
        activity_level: activityLevel,
        goal,
        target_weight: targetWeight ? parseFloat(targetWeight) : null
      });
      fetchProfile();
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!profile && !isEditing) {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.screenTitle}>👤 Create Profile</Text>
        <View style={styles.card}>
          <Text style={styles.emptyText}>No profile yet. Create one to start tracking!</Text>
          <TouchableOpacity style={styles.button} onPress={() => setIsEditing(true)}>
            <Text style={styles.buttonText}>Create Profile</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  if (isEditing || !profile) {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.screenTitle}>👤 {profile ? 'Edit' : 'Create'} Profile</Text>
        
        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder="Name *"
            value={name}
            onChangeText={setName}
          />

          <View style={styles.inputRow}>
            <TextInput
              style={[styles.input, styles.inputHalf]}
              placeholder="Age *"
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
            />
            <TextInput
              style={[styles.input, styles.inputHalf]}
              placeholder="Height (cm) *"
              value={height}
              onChangeText={setHeight}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputRow}>
            <TextInput
              style={[styles.input, styles.inputHalf]}
              placeholder="Weight (kg) *"
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
            />
            <TextInput
              style={[styles.input, styles.inputHalf]}
              placeholder="Target Weight (kg)"
              value={targetWeight}
              onChangeText={setTargetWeight}
              keyboardType="numeric"
            />
          </View>

          <Text style={styles.sectionLabel}>Gender</Text>
          <View style={styles.optionButtons}>
            {['male', 'female', 'other'].map(g => (
              <TouchableOpacity
                key={g}
                style={[styles.optionButton, gender === g && styles.optionButtonActive]}
                onPress={() => setGender(g)}
              >
                <Text style={[styles.optionText, gender === g && styles.optionTextActive]}>
                  {g.charAt(0).toUpperCase() + g.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionLabel}>Activity Level</Text>
          <View style={styles.optionButtons}>
            {[
              { value: 'sedentary', label: 'Sedentary' },
              { value: 'light', label: 'Light' },
              { value: 'moderate', label: 'Moderate' },
              { value: 'active', label: 'Active' },
              { value: 'very_active', label: 'Very Active' }
            ].map(option => (
              <TouchableOpacity
                key={option.value}
                style={[styles.optionButton, activityLevel === option.value && styles.optionButtonActive]}
                onPress={() => setActivityLevel(option.value)}
              >
                <Text style={[styles.optionText, activityLevel === option.value && styles.optionTextActive]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionLabel}>Goal</Text>
          <View style={styles.optionButtons}>
            {[
              { value: 'lose_weight', label: 'Lose Weight' },
              { value: 'maintain', label: 'Maintain' },
              { value: 'gain_weight', label: 'Gain Weight' }
            ].map(option => (
              <TouchableOpacity
                key={option.value}
                style={[styles.optionButton, goal === option.value && styles.optionButtonActive]}
                onPress={() => setGoal(option.value)}
              >
                <Text style={[styles.optionText, goal === option.value && styles.optionTextActive]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity 
            style={styles.button} 
            onPress={profile ? updateProfile : createProfile}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>{profile ? 'Update Profile' : 'Create Profile'}</Text>
            )}
          </TouchableOpacity>

          {profile && (
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: '#666', marginTop: 8 }]}
              onPress={() => {
                setIsEditing(false);
                fetchProfile();
              }}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.screenTitle}>👤 Profile</Text>

      <View style={styles.card}>
        <View style={styles.profileHeader}>
          <Text style={styles.profileName}>{profile.name}</Text>
          <TouchableOpacity onPress={() => setIsEditing(true)}>
            <Text style={styles.editButton}>✏️ Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.profileInfo}>
          <View style={styles.profileInfoItem}>
            <Text style={styles.profileInfoLabel}>Age</Text>
            <Text style={styles.profileInfoValue}>{profile.age}</Text>
          </View>
          <View style={styles.profileInfoItem}>
            <Text style={styles.profileInfoLabel}>Gender</Text>
            <Text style={styles.profileInfoValue}>{profile.gender}</Text>
          </View>
          <View style={styles.profileInfoItem}>
            <Text style={styles.profileInfoLabel}>Height</Text>
            <Text style={styles.profileInfoValue}>{profile.height} cm</Text>
          </View>
          <View style={styles.profileInfoItem}>
            <Text style={styles.profileInfoLabel}>Weight</Text>
            <Text style={styles.profileInfoValue}>{profile.weight} kg</Text>
          </View>
          <View style={styles.profileInfoItem}>
            <Text style={styles.profileInfoLabel}>Activity</Text>
            <Text style={styles.profileInfoValue}>
              {profile.activity_level.replace('_', ' ')}
            </Text>
          </View>
          <View style={styles.profileInfoItem}>
            <Text style={styles.profileInfoLabel}>Goal</Text>
            <Text style={styles.profileInfoValue}>
              {profile.goal.replace('_', ' ')}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

// ==================== MAIN APP ====================
export default function App() {
  const [userId, setUserId] = useState('demo_user_' + Date.now());

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: '#999',
          tabBarStyle: { height: 60, paddingBottom: 8, paddingTop: 8 },
          headerShown: false
        }}
      >
        <Tab.Screen 
          name="Dashboard" 
          options={{
            tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} emoji="📊" />
          }}
        >
          {() => <DashboardScreen userId={userId} />}
        </Tab.Screen>
        <Tab.Screen 
          name="Meals" 
          options={{
            tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} emoji="🍽️" />
          }}
        >
          {() => <MealsScreen userId={userId} />}
        </Tab.Screen>
        <Tab.Screen 
          name="Water" 
          options={{
            tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} emoji="💧" />
          }}
        >
          {() => <WaterScreen userId={userId} />}
        </Tab.Screen>
        <Tab.Screen 
          name="Profile" 
          options={{
            tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} emoji="👤" />
          }}
        >
          {() => <ProfileScreen userId={userId} setUserId={setUserId} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// ==================== STYLES ====================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#007AFF',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  refreshButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    padding: 20,
    paddingTop: 60,
  },
  card: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  inputHalf: {
    flex: 1,
  },
  inputThird: {
    flex: 1,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    padding: 20,
    fontStyle: 'italic',
  },
  calorieStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  calorieItem: {
    alignItems: 'center',
  },
  calorieLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  calorieValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  macroGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  macroItem: {
    alignItems: 'center',
  },
  macroEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  macroLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  macroValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  waterText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 12,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  statLabel: {
    fontSize: 16,
    color: '#666',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  mealTypeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  mealTypeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  mealTypeButtonActive: {
    backgroundColor: '#007AFF',
  },
  mealTypeText: {
    fontSize: 14,
    color: '#666',
  },
  mealTypeTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  sectionLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    marginBottom: 8,
  },
  mealSection: {
    marginTop: 16,
  },
  mealSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  mealItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  mealItemInfo: {
    flex: 1,
  },
  mealItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  mealItemDetails: {
    fontSize: 14,
    color: '#666',
  },
  mealItemMacros: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  deleteButton: {
    fontSize: 20,
    padding: 8,
  },
  waterButtonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  waterButton: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  waterButtonEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  waterButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  waterLargeText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2196F3',
    textAlign: 'center',
  },
  waterSubText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  optionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  optionButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  optionText: {
    fontSize: 14,
    color: '#666',
  },
  optionTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  editButton: {
    fontSize: 16,
    color: '#007AFF',
  },
  profileInfo: {
    gap: 12,
  },
  profileInfoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  profileInfoLabel: {
    fontSize: 16,
    color: '#666',
  },
  profileInfoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textTransform: 'capitalize',
  },
});
