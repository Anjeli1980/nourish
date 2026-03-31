import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { BACKEND_URL, LAPTOP_IP } from './config';

// Backend URL is configured in config.js
// To update: Edit mobile/config.js and change LAPTOP_IP

export default function App() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [clientName, setClientName] = useState('');
  const [statusChecks, setStatusChecks] = useState([]);

  // Test backend connection on app load
  useEffect(() => {
    testBackendConnection();
  }, []);

  const testBackendConnection = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BACKEND_URL}/`);
      setMessage(response.data.message);
      fetchStatusChecks();
    } catch (error) {
      console.error('Error connecting to backend:', error);
      Alert.alert(
        'Connection Error',
        'Cannot connect to backend. Make sure:\n1. Backend is running on your laptop\n2. Phone and laptop are on same WiFi\n3. Update BACKEND_URL in App.js with your laptop IP'
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchStatusChecks = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/status`);
      setStatusChecks(response.data);
    } catch (error) {
      console.error('Error fetching status checks:', error);
    }
  };

  const createStatusCheck = async () => {
    if (!clientName.trim()) {
      Alert.alert('Error', 'Please enter a client name');
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${BACKEND_URL}/status`, {
        client_name: clientName
      });
      Alert.alert('Success', 'Status check created!');
      setClientName('');
      fetchStatusChecks();
    } catch (error) {
      console.error('Error creating status check:', error);
      Alert.alert('Error', 'Failed to create status check');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !message) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Connecting to backend...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🌱 Nourish App</Text>
        <Text style={styles.subtitle}>React Native + FastAPI</Text>
      </View>

      {/* Backend Status */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Backend Status</Text>
        <View style={styles.statusRow}>
          <View style={[styles.statusDot, { backgroundColor: message ? '#4CAF50' : '#F44336' }]} />
          <Text style={styles.statusText}>
            {message || 'Disconnected'}
          </Text>
        </View>
        <TouchableOpacity style={styles.refreshButton} onPress={testBackendConnection}>
          <Text style={styles.refreshButtonText}>🔄 Refresh Connection</Text>
        </TouchableOpacity>
      </View>

      {/* Create Status Check Form */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Create Status Check</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter client name"
          value={clientName}
          onChangeText={setClientName}
          placeholderTextColor="#999"
        />
        <TouchableOpacity 
          style={styles.button} 
          onPress={createStatusCheck}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>✓ Create Status Check</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Status Checks List */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Status Checks ({statusChecks.length})</Text>
        {statusChecks.length === 0 ? (
          <Text style={styles.emptyText}>No status checks yet. Create one above!</Text>
        ) : (
          statusChecks.map((check, index) => (
            <View key={check.id || index} style={styles.checkItem}>
              <Text style={styles.checkName}>👤 {check.client_name}</Text>
              <Text style={styles.checkTime}>
                {new Date(check.timestamp).toLocaleString()}
              </Text>
            </View>
          ))
        )}
      </View>

      {/* Connection Info */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>📱 Connection Info</Text>
        <Text style={styles.infoText}>Backend URL: {BACKEND_URL}</Text>
        <Text style={styles.infoTextSmall}>
          Make sure your phone and laptop are on the same WiFi network
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Built with React Native + Expo</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 30,
    paddingTop: 60,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginTop: 4,
  },
  card: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    color: '#666',
  },
  refreshButton: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  refreshButtonText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
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
    fontStyle: 'italic',
  },
  checkItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingVertical: 12,
  },
  checkName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  checkTime: {
    fontSize: 12,
    color: '#999',
  },
  infoCard: {
    backgroundColor: '#fff3cd',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ffc107',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#856404',
    marginBottom: 4,
    fontFamily: 'monospace',
  },
  infoTextSmall: {
    fontSize: 11,
    color: '#856404',
    fontStyle: 'italic',
    marginTop: 4,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
  },
});
