import React, { useCallback, useState } from "react";
import {
  TextInput,
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import debounce from "lodash.debounce";
import { Colors } from "@/constants/Colors";
import {
  registerUser,
  createUserDocument,
  isUsernameTaken,
  isEmailTaken,
} from "@/api/authAPI";
import { Link, router } from "expo-router";

const validationSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters long"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
});

const RegisterScreen = () => {
  const [usernameAvailable, setUsernameAvailable] = useState(true);
  const [emailAvailable, setEmailAvailable] = useState(true);
  const [bluredEmail, setBluredEmail] = useState(false);
  const [bluredPassword, setBluredPassword] = useState(false);
  const [bluredConfirmation, setBluredConfirmation] = useState(false);
  const [bluredUsername, setBluredUsername] = useState(false);

  const checkUsernameAvailability = useCallback(
    debounce(async (username: string) => {
      try {
        const used = await isUsernameTaken(username);
        setUsernameAvailable(!used);
      } catch (error) {
        console.error(error);
        setUsernameAvailable(false);
      }
    }, 500),
    []
  );
  const checkEmailAvailability = useCallback(
    debounce(async (email: string) => {
      try {
        const used = await isEmailTaken(email);
        setEmailAvailable(!used);
      } catch (error) {
        console.error(error);
        setEmailAvailable(false);
      }
    }, 500),
    []
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View
          style={{
            backgroundColor: Colors.background,
            justifyContent: "center",
            width: "80%",
            minHeight: "100%",
          }}
        >
          <View
            style={{
              backgroundColor: Colors.background,
              flex: 1,
              display: "flex",
              padding: 20,
              width: "100%",
              marginTop: 50,
            }}
          >
            <Text style={styles.header}>Dare Up</Text>
            <SafeAreaView style={styles.container}>
              <Formik
                initialValues={{
                  username: "",
                  email: "",
                  password: "",
                  confirmPassword: "",
                }}
                validationSchema={validationSchema}
                onSubmit={async (values) => {
                  try {
                    const uid = await registerUser(
                      values.email,
                      values.password
                    );
                    if (uid) {
                      const user: RegisteredUser = {
                        uid: uid,
                        email: values.email,
                        username: values.username,
                      };
                      await createUserDocument(user);
                      router.push("/(app)");
                    }
                  } catch (err) {
                    console.log("Some Error During Registration: ",err);
                  }
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
                  <View style={{ width: "100%" }}>
                    <TextInput
                      placeholder="Username"
                      placeholderTextColor={Colors.placeholderText}
                      autoCapitalize="none"
                      onChangeText={(text) => {
                        setBluredUsername(false);
                        handleChange("username")(text);
                        checkUsernameAvailability(text);
                      }}
                      onBlur={(e) => {
                        setBluredUsername(true);
                        handleBlur("username")(e);
                      }}
                      value={values.username}
                      style={{
                        ...styles.input,
                      }}
                    />
                    {bluredUsername && touched.username && errors.username && (
                      <Text style={styles.messages}>{errors.username}</Text>
                    )}
                    {bluredUsername && !usernameAvailable && (
                      <Text style={styles.messages}>
                        Username is already in use
                      </Text>
                    )}

                    <TextInput
                      placeholder="Email"
                      placeholderTextColor={Colors.placeholderText}
                      autoCapitalize="none"
                      onChangeText={(text) => {
                        setBluredEmail(false);
                        handleChange("email")(text);
                        checkEmailAvailability(text);
                      }}
                      onBlur={(e) => {
                        setBluredEmail(true);
                        handleBlur("email")(e);
                      }}
                      value={values.email}
                      autoCorrect
                      autoComplete="email"
                      inputMode="email"
                      style={styles.input}
                    />
                    {bluredEmail && touched.email && errors.email && (
                      <Text style={styles.messages}>{errors.email}</Text>
                    )}
                    {bluredEmail && !emailAvailable && (
                      <Text style={styles.messages}>
                        Email is already in use
                      </Text>
                    )}

                    <TextInput
                      placeholder="Password"
                      placeholderTextColor={Colors.placeholderText}
                      onChangeText={(text) => {
                        setBluredPassword(false);
                        handleChange("password")(text);
                      }}
                      onBlur={(e) => {
                        setBluredPassword(true);
                        handleBlur("password")(e);
                      }}
                      secureTextEntry
                      value={values.password}
                      style={styles.input}
                    />
                    {bluredPassword && touched.password && errors.password && (
                      <Text style={styles.messages}>{errors.password}</Text>
                    )}

                    <TextInput
                      placeholder="Confirm Password"
                      placeholderTextColor={Colors.placeholderText}
                      onChangeText={(text) => {
                        setBluredConfirmation(false);
                        handleChange("confirmPassword")(text);
                      }}
                      onBlur={(e) => {
                        setBluredConfirmation(true);
                        handleBlur("confirmPassword")(e);
                      }}
                      value={values.confirmPassword}
                      style={styles.input}
                      secureTextEntry
                    />
                    {bluredConfirmation &&
                      touched.confirmPassword &&
                      errors.confirmPassword && (
                        <Text style={styles.messages}>
                          {errors.confirmPassword}
                        </Text>
                      )}

                    <TouchableOpacity
                      activeOpacity={0.6}
                      onPress={() => {
                        setBluredEmail(true);
                        setBluredPassword(true);
                        setBluredConfirmation(true);
                        setBluredUsername(true);
                        handleSubmit();
                      }}
                      style={styles.button}
                      disabled={!emailAvailable || !usernameAvailable}
                    >
                      <Text style={{ color: Colors.background }}>Dare Up</Text>
                    </TouchableOpacity>
                    <View
                      style={{
                        marginTop: 20,
                      }}
                    >
                      <Text style={{ color: Colors.text, marginBottom: 15 }}>
                        Already Dared?{" "}
                        <Link
                          href={"/auth/login"}
                          style={{
                            fontWeight: "bold",
                          }}
                        >
                          Dare In
                        </Link>
                      </Text>
                    </View>
                  </View>
                )}
              </Formik>
            </SafeAreaView>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 60,
    color: Colors.text,
    marginTop: 40,
    textAlign: "center",
  },
  input: {
    borderWidth: 0,
    borderColor: Colors.text,
    color: Colors.text,
    borderBottomWidth: 1,
    width: "100%",
    paddingBottom: 10,
    marginTop: 20,
  },
  messages: {
    color: Colors.errorMessage,
    marginTop: 5,
  },
  button: {
    backgroundColor: Colors.text,
    padding: 10,
    borderRadius: 50,
    width: "100%",
    marginTop: 30,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default RegisterScreen;
