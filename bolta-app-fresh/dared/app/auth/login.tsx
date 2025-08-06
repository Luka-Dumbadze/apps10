import React, { useState, useEffect } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as Yup from 'yup';
import { useAuth } from '../../providers/session';
import { Colors } from '@/constants/Colors';
import { Formik } from 'formik';
import { Link, router } from 'expo-router';

export default function SignIn() {
  const { signIn, user, loading } = useAuth();
  const [bluredEmail, setBluredEmail] = useState(false);
  const [bluredPassword, setBluredPassword] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.push('/(app)');
    }
  }, [user, loading]);

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters long')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/\d/, 'Password must contain at least one number')
      .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
  });

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={{ minHeight: '100%', width: '80%' }}>
          <SafeAreaView
            style={{
              flex: 1,
              alignItems: 'center',
              backgroundColor: Colors.background,
            }}
          >
            <View
              style={{
                backgroundColor: Colors.background,
                flex: 1,
                padding: 20,
                width: '100%',
                marginTop: 50,
              }}
            >
              <Text style={styles.header}>Dare In</Text>
              <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                  Keyboard.dismiss();
                  signIn(values.email, values.password);
                }}
              >
                {({
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  values,
                  errors,
                  touched,
                }) => (
                  <View>
                    <TextInput
                      placeholder="Email"
                      placeholderTextColor={Colors.placeholderText}
                      autoCapitalize="none"
                      onChangeText={(text) => {
                        setBluredEmail(false);
                        handleChange('email')(text);
                      }}
                      onBlur={(e) => {
                        setBluredEmail(true);
                        handleBlur('email')(e);
                      }}
                      value={values.email}
                      autoComplete="email"
                      autoCorrect
                      style={styles.input}
                      inputMode="email"
                    />
                    {bluredEmail && touched.email && errors.email && (
                      <Text style={styles.messages}>{errors.email}</Text>
                    )}
                    <TextInput
                      placeholder="Password"
                      placeholderTextColor={Colors.placeholderText}
                      secureTextEntry
                      onChangeText={(t) => {
                        setBluredPassword(false);
                        handleChange('password')(t);
                      }}
                      onBlur={(e) => {
                        setBluredPassword(true);
                        handleBlur('password')(e);
                      }}
                      style={styles.input}
                      value={values.password}
                    />
                    {bluredPassword && touched.password && errors.password && (
                      <Text style={styles.messages}>{errors.password}</Text>
                    )}
                    <TouchableOpacity
                      activeOpacity={0.6}
                      onPress={() => {
                        setBluredEmail(true);
                        setBluredPassword(true);
                        handleSubmit();
                      }}
                      style={styles.button}
                    >
                      <Text style={{ color: Colors.background }}>Dare In</Text>
                    </TouchableOpacity>
                    <View style={{ marginTop: 20 }}>
                      <Text style={{ color: Colors.text, marginBottom: 15 }}>
                        Never Dared Before?{' '}
                        <Link href="/auth/register" style={{ fontWeight: 'bold' }}>
                          Dare Up
                        </Link>
                      </Text>
                    </View>
                  </View>
                )}
              </Formik>
            </View>
          </SafeAreaView>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    borderWidth: 0,
    borderColor: Colors.text,
    color: Colors.text,
    borderBottomWidth: 1,
    width: '100%',
    paddingBottom: 10,
    marginTop: 20,
  },
  header: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 60,
    color: Colors.text,
    marginTop: 40,
    textAlign: 'center',
  },
  button: {
    backgroundColor: Colors.text,
    padding: 10,
    borderRadius: 50,
    width: '100%',
    marginTop: 30,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messages: {
    color: Colors.errorMessage,
    marginTop: 5,
  },
});
