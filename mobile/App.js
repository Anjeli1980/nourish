import React, { useState, useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, 
  Alert, ActivityIndicator, Animated, Dimensions, Platform 
} from 'react-native';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { BACKEND_URL } from './config';

const { width, height } = Dimensions.get('window');
const Tab = createBottomTabNavigator();

// Modern Color Palette
const COLORS = {
  primary: '#6C5CE7',      // Purple
  secondary: '#A29BFE',    // Light Purple
  accent: '#00B894',       // Green
  success: '#00B894',      // Green
  danger: '#FF7675',       // Red
  warning: '#FDCB6E',      // Yellow
  info: '#74B9FF',         // Blue
  dark: '#2D3436',         // Dark Gray
  light: '#DFE6E9',        // Light Gray
  white: '#FFFFFF',
  background: '#F8F9FA',
  cardBg: '#FFFFFF',
  textPrimary: '#2D3436',
  textSecondary: '#636E72',
  gradient1: ['#6C5CE7', '#A29BFE'],
  gradient2: ['#00B894', '#55EFC4'],
  gradient3: ['#FF7675', '#FD79A8'],
  gradient4: ['#74B9FF', '#A29BFE'],
};

// Animated Components
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

// Custom Tab Bar Icon
const TabBarIcon = ({ focused, emoji, label }) => {
  const scale = useRef(new Animated.Value(focused ? 1 : 0.9)).current;
  
  useEffect(() => {
    Animated.spring(scale, {
      toValue: focused ? 1.1 : 0.9,
      friction: 3,
      useNativeDriver: true,
    }).start();
  }, [focused]);

  return (
    <Animated.View style={[styles.tabIconContainer, { transform: [{ scale }] }]}>
      {focused && (
        <View style={[styles.tabIndicator, { backgroundColor: COLORS.primary }]} />
      )}
      <Text style={[styles.tabIcon, focused && styles.tabIconFocused]}>{emoji}</Text>
      <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>{label}</Text>
    </Animated.View>
  );
};

// Loading Skeleton Component
const SkeletonLoader = () => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={[styles.skeleton, { opacity }]} />
  );
};

// Welcome Screen Component
const WelcomeScreen = ({ onStart }) => {
  return (
    <LinearGradient colors={COLORS.gradient1} style={styles.welcomeContainer}>
      <Animatable.View animation="fadeInDown" delay={300} style={styles.welcomeContent}>
        <Text style={styles.welcomeEmoji}>🌱</Text>
        <Text style={styles.welcomeTitle}>Welcome to Nourish</Text>
        <Text style={styles.welcomeSubtitle}>
          Your AI-Powered Personal Diet Planner
        </Text>
        <Animatable.View animation="pulse" iterationCount="infinite" duration={2000}>
          <TouchableOpacity style={styles.welcomeButton} onPress={onStart}>
            <LinearGradient colors={[COLORS.white, COLORS.light]} style={styles.welcomeButtonGradient}>
              <Text style={styles.welcomeButtonText}>Get Started</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animatable.View>
        
        <View style={styles.featureList}>
          <Animatable.View animation="fadeInLeft" delay={600} style={styles.featureItem}>
            <Text style={styles.featureIcon}>📊</Text>
            <Text style={styles.featureText}>Track Your Nutrition</Text>
          </Animatable.View>
          <Animatable.View animation="fadeInLeft" delay={800} style={styles.featureItem}>
            <Text style={styles.featureIcon}>🤖</Text>
            <Text style={styles.featureText}>AI-Powered Suggestions</Text>
          </Animatable.View>
          <Animatable.View animation="fadeInLeft" delay={1000} style={styles.featureItem}>
            <Text style={styles.featureIcon}>💪</Text>
            <Text style={styles.featureText}>Achieve Your Goals</Text>
          </Animatable.View>
        </View>
      </Animatable.View>
    </LinearGradient>
  );
};

// ==================== DASHBOARD SCREEN ====================
function DashboardScreen({ userId, hasProfile }) {
  const [stats, setStats] = useState(null);
  const [dailySummary, setDailySummary] = useState(null);
  const [waterIntake, setWaterIntake] = useState(null);
  const [loading, setLoading] = useState(true);
  const progressAnim = useRef(new Animated.Value(0)).current;

  const fetchData = async () => {
    if (!hasProfile) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];
      
      const [statsRes, summaryRes, waterRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/profile/${userId}/stats`).catch(() => null),
        axios.get(`${BACKEND_URL}/meals/${userId}/${today}/summary`).catch(() => null),
        axios.get(`${BACKEND_URL}/water/${userId}/${today}`).catch(() => null)
      ]);
      
      if (statsRes) setStats(statsRes.data);
      if (summaryRes) setDailySummary(summaryRes.data);
      if (waterRes) setWaterIntake(waterRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId, hasProfile]);

  useEffect(() => {
    if (stats && dailySummary) {
      const percentage = Math.min((dailySummary.total_calories / stats.target_calories) * 100, 100);
      Animated.timing(progressAnim, {
        toValue: percentage,
        duration: 1000,
        useNativeDriver: false,
      }).start();
    }
  }, [stats, dailySummary]);

  if (loading) {
    return (
      <LinearGradient colors={[COLORS.background, COLORS.white]} style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading your dashboard...</Text>
        </View>
      </LinearGradient>
    );
  }

  if (!hasProfile) {
    return (
      <LinearGradient colors={COLORS.gradient1} style={styles.container}>
        <View style={styles.emptyStateContainer}>
          <Animatable.Text animation="bounceIn" style={styles.emptyStateEmoji}>
            👤
          </Animatable.Text>
          <Text style={styles.emptyStateTitle}>Create Your Profile First!</Text>
          <Text style={styles.emptyStateText}>
            Go to the Profile tab to set up your account and start tracking your nutrition journey.
          </Text>
        </View>
      </LinearGradient>
    );
  }

  const caloriesConsumed = dailySummary?.total_calories || 0;
  const caloriesRemaining = stats.target_calories - caloriesConsumed;
  const caloriesPercentage = Math.min((caloriesConsumed / stats.target_calories) * 100, 100);

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={COLORS.gradient1} style={styles.headerGradient}>
        <Animatable.View animation="fadeInDown" style={styles.headerContent}>
          <Text style={styles.headerTitle}>Dashboard</Text>
          <Text style={styles.headerSubtitle}>Track your daily nutrition</Text>
          <TouchableOpacity onPress={fetchData} style={styles.refreshButton}>
            <Text style={styles.refreshIcon}>🔄</Text>
          </TouchableOpacity>
        </Animatable.View>
      </LinearGradient>

      {/* Calorie Card with Animation */}
      <Animatable.View animation="fadeInUp" delay={200} style={styles.card}>
        <LinearGradient colors={['#FFFFFF', '#F8F9FA']} style={styles.cardGradient}>
          <Text style={styles.cardTitle}>Today's Calories</Text>
          
          <View style={styles.calorieMainDisplay}>
            <View style={styles.calorieCircle}>
              <Text style={styles.calorieMainNumber}>{Math.round(caloriesConsumed)}</Text>
              <Text style={styles.calorieMainLabel}>consumed</Text>
            </View>
          </View>

          <View style={styles.calorieStats}>
            <View style={styles.calorieStatItem}>
              <Text style={styles.calorieStatLabel}>Goal</Text>
              <Text style={[styles.calorieStatValue, { color: COLORS.primary }]}>
                {Math.round(stats.target_calories)}
              </Text>
            </View>
            <View style={styles.calorieStatDivider} />
            <View style={styles.calorieStatItem}>
              <Text style={styles.calorieStatLabel}>Remaining</Text>
              <Text style={[styles.calorieStatValue, { 
                color: caloriesRemaining >= 0 ? COLORS.success : COLORS.danger 
              }]}>
                {Math.round(caloriesRemaining)}
              </Text>
            </View>
          </View>

          <View style={styles.progressBarContainer}>
            <Animated.View 
              style={[
                styles.progressBar, 
                { 
                  width: progressAnim.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%'],
                  }),
                  backgroundColor: caloriesPercentage > 100 ? COLORS.danger : COLORS.success,
                }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>{Math.round(caloriesPercentage)}% of daily goal</Text>
        </LinearGradient>
      </Animatable.View>

      {/* Macros Card */}
      <Animatable.View animation="fadeInUp" delay={400} style={styles.card}>
        <LinearGradient colors={['#FFFFFF', '#F8F9FA']} style={styles.cardGradient}>
          <Text style={styles.cardTitle}>Macronutrients</Text>
          <View style={styles.macroGrid}>
            <View style={styles.macroItem}>
              <LinearGradient colors={['#FF7675', '#FD79A8']} style={styles.macroIcon}>
                <Text style={styles.macroEmoji}>🥩</Text>
              </LinearGradient>
              <Text style={styles.macroLabel}>Protein</Text>
              <Text style={styles.macroValue}>{Math.round(dailySummary?.total_protein || 0)}g</Text>
            </View>
            <View style={styles.macroItem}>
              <LinearGradient colors={['#FDCB6E', '#FD79A8']} style={styles.macroIcon}>
                <Text style={styles.macroEmoji}>🍞</Text>
              </LinearGradient>
              <Text style={styles.macroLabel}>Carbs</Text>
              <Text style={styles.macroValue}>{Math.round(dailySummary?.total_carbs || 0)}g</Text>
            </View>
            <View style={styles.macroItem}>
              <LinearGradient colors={['#00B894', '#55EFC4']} style={styles.macroIcon}>
                <Text style={styles.macroEmoji}>🥑</Text>
              </LinearGradient>
              <Text style={styles.macroLabel}>Fats</Text>
              <Text style={styles.macroValue}>{Math.round(dailySummary?.total_fats || 0)}g</Text>
            </View>
          </View>
        </LinearGradient>
      </Animatable.View>

      {/* Water Card */}
      <Animatable.View animation="fadeInUp" delay={600} style={styles.card}>
        <LinearGradient colors={COLORS.gradient4} style={styles.cardGradient}>
          <Text style={[styles.cardTitle, { color: COLORS.white }]}>💧 Water Intake</Text>
          <Text style={styles.waterText}>
            {waterIntake?.total_ml || 0}ml / 2000ml
          </Text>
          <Text style={styles.waterPercentage}>{waterIntake?.percentage || 0}%</Text>
          <View style={[styles.progressBarContainer, { backgroundColor: 'rgba(255,255,255,0.3)' }]}>
            <View style={[
              styles.progressBar, 
              { 
                width: `${Math.min(waterIntake?.percentage || 0, 100)}%`,
                backgroundColor: COLORS.white 
              }
            ]} />
          </View>
        </LinearGradient>
      </Animatable.View>

      {/* Stats Card */}
      <Animatable.View animation="fadeInUp" delay={800} style={styles.card}>
        <LinearGradient colors={['#FFFFFF', '#F8F9FA']} style={styles.cardGradient}>
          <Text style={styles.cardTitle}>Your Statistics</Text>
          {[
            { label: 'BMI', value: stats.bmi, color: COLORS.primary },
            { label: 'BMR', value: `${Math.round(stats.bmr)} cal/day`, color: COLORS.accent },
            { label: 'TDEE', value: `${Math.round(stats.tdee)} cal/day`, color: COLORS.info },
            { label: 'Weight', value: `${stats.current_weight} kg`, color: COLORS.danger },
          ].map((stat, index) => (
            <View key={index} style={styles.statRow}>
              <View style={styles.statLabelContainer}>
                <View style={[styles.statDot, { backgroundColor: stat.color }]} />
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
              <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
            </View>
          ))}
        </LinearGradient>
      </Animatable.View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

// ==================== MEALS SCREEN ====================
function MealsScreen({ userId, hasProfile }) {
  const [mealType, setMealType] = useState('breakfast');
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');
  const [servingSize, setServingSize] = useState('1 serving');
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const fetchMeals = async () => {
    if (!hasProfile) return;
    try {
      const response = await axios.get(`${BACKEND_URL}/meals/${userId}/${today}`);
      setMeals(response.data);
    } catch (error) {
      console.error('Error fetching meals:', error);
    }
  };

  useEffect(() => {
    if (hasProfile) fetchMeals();
  }, [userId, hasProfile]);

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

      Alert.alert('Success', 'Meal logged! 🎉');
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

  const getAISuggestions = async () => {
    try {
      setLoadingAI(true);
      setShowAI(true);
      const response = await axios.post(`${BACKEND_URL}/ai/meal-suggestions`, {
        user_id: userId,
        meal_type: mealType,
        calories_remaining: 500
      });
      setAiSuggestions(response.data.suggestions);
    } catch (error) {
      Alert.alert('Error', 'AI suggestions unavailable');
      setAiSuggestions('AI service is currently unavailable. Please try again later.');
    } finally {
      setLoadingAI(false);
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

  if (!hasProfile) {
    return (
      <LinearGradient colors={COLORS.gradient2} style={styles.container}>
        <View style={styles.emptyStateContainer}>
          <Animatable.Text animation="bounceIn" style={styles.emptyStateEmoji}>
            👤
          </Animatable.Text>
          <Text style={styles.emptyStateTitle}>Profile Required</Text>
          <Text style={styles.emptyStateText}>
            Please create your profile first to start logging meals.
          </Text>
        </View>
      </LinearGradient>
    );
  }

  const mealsByType = {
    breakfast: meals.filter(m => m.meal_type === 'breakfast'),
    lunch: meals.filter(m => m.meal_type === 'lunch'),
    dinner: meals.filter(m => m.meal_type === 'dinner'),
    snack: meals.filter(m => m.meal_type === 'snack')
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={COLORS.gradient2} style={styles.headerGradient}>
        <Animatable.View animation="fadeInDown" style={styles.headerContent}>
          <Text style={styles.headerTitle}>Log Meal</Text>
          <Text style={styles.headerSubtitle}>Track what you eat today</Text>
        </Animatable.View>
      </LinearGradient>

      <Animatable.View animation="fadeInUp" delay={200} style={styles.card}>
        <LinearGradient colors={['#FFFFFF', '#F8F9FA']} style={styles.cardGradient}>
          <Text style={styles.cardTitle}>Meal Type</Text>
          <View style={styles.mealTypeButtons}>
            {[
              { type: 'breakfast', emoji: '🌅', label: 'Breakfast' },
              { type: 'lunch', emoji: '☀️', label: 'Lunch' },
              { type: 'dinner', emoji: '🌙', label: 'Dinner' },
              { type: 'snack', emoji: '🍎', label: 'Snack' }
            ].map(({ type, emoji, label }) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.mealTypeButton,
                  mealType === type && styles.mealTypeButtonActive
                ]}
                onPress={() => setMealType(type)}
              >
                {mealType === type && (
                  <LinearGradient
                    colors={COLORS.gradient2}
                    style={styles.mealTypeButtonGradient}
                  >
                    <Text style={styles.mealTypeEmoji}>{emoji}</Text>
                    <Text style={styles.mealTypeTextActive}>{label}</Text>
                  </LinearGradient>
                )}
                {mealType !== type && (
                  <View style={styles.mealTypeButtonInactive}>
                    <Text style={styles.mealTypeEmoji}>{emoji}</Text>
                    <Text style={styles.mealTypeText}>{label}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* AI Suggestion Button */}
          <TouchableOpacity style={styles.aiButton} onPress={getAISuggestions}>
            <LinearGradient colors={COLORS.gradient1} style={styles.aiButtonGradient}>
              <Text style={styles.aiButtonText}>🤖 Get AI Suggestions</Text>
            </LinearGradient>
          </TouchableOpacity>

          {showAI && (
            <Animatable.View animation="fadeIn" style={styles.aiSuggestionsBox}>
              {loadingAI ? (
                <ActivityIndicator color={COLORS.primary} />
              ) : (
                <Text style={styles.aiSuggestionsText}>{aiSuggestions}</Text>
              )}
            </Animatable.View>
          )}

          <TextInput
            style={styles.input}
            placeholder="Food name (e.g., Grilled Chicken)"
            value={foodName}
            onChangeText={setFoodName}
            placeholderTextColor={COLORS.textSecondary}
          />

          <View style={styles.inputRow}>
            <TextInput
              style={[styles.input, styles.inputHalf]}
              placeholder="Calories"
              value={calories}
              onChangeText={setCalories}
              keyboardType="numeric"
              placeholderTextColor={COLORS.textSecondary}
            />
            <TextInput
              style={[styles.input, styles.inputHalf]}
              placeholder="Serving"
              value={servingSize}
              onChangeText={setServingSize}
              placeholderTextColor={COLORS.textSecondary}
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
              placeholderTextColor={COLORS.textSecondary}
            />
            <TextInput
              style={[styles.input, styles.inputThird]}
              placeholder="Carbs (g)"
              value={carbs}
              onChangeText={setCarbs}
              keyboardType="numeric"
              placeholderTextColor={COLORS.textSecondary}
            />
            <TextInput
              style={[styles.input, styles.inputThird]}
              placeholder="Fats (g)"
              value={fats}
              onChangeText={setFats}
              keyboardType="numeric"
              placeholderTextColor={COLORS.textSecondary}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={addMeal} disabled={loading}>
            <LinearGradient colors={COLORS.gradient2} style={styles.buttonGradient}>
              {loading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.buttonText}>✓ Log Meal</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>
      </Animatable.View>

      {/* Today's Meals */}
      <Animatable.View animation="fadeInUp" delay={400} style={styles.card}>
        <LinearGradient colors={['#FFFFFF', '#F8F9FA']} style={styles.cardGradient}>
          <Text style={styles.cardTitle}>Today's Meals ({meals.length})</Text>
          
          {Object.entries(mealsByType).map(([type, typeMeals], index) => (
            typeMeals.length > 0 && (
              <Animatable.View key={type} animation="fadeInLeft" delay={index * 100}>
                <Text style={styles.mealSectionTitle}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
                {typeMeals.map((meal) => (
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
              </Animatable.View>
            )
          ))}

          {meals.length === 0 && (
            <Text style={styles.emptyText}>No meals logged today. Add one above!</Text>
          )}
        </LinearGradient>
      </Animatable.View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

// Continue in next message due to length...
