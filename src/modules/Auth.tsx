import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import { ButtonSize } from 'react-native-ui-lib';
import AppButton from 'src/components/AppButton';
import AppTextField from 'src/components/AppTextField';
import { MaterialIcons } from '@expo/vector-icons';
import { supabase } from 'src/lib/supabase';

export default function Auth() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [validation, setValidation] = useState({
    email: false,
    password: false,
  });
  const isValid = Object.values(validation).every((val) => val === true);
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { user, error } = await supabase.auth.signIn({ email, password });
    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const { user, error } = await supabase.auth.signUp({ email, password });
    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  return (
    <View
      style={{
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      }}
    >
      <View style={{ width: '100%' }}>
        <AppTextField
          leadingAccessory={
            <MaterialIcons name="mail-outline" size={24} color="black" style={{ marginRight: 4 }} />
          }
          placeholder={'Email'}
          floatingPlaceholder
          onChangeText={(text: string) => setEmail(text)}
          enableErrors
          validateOnBlur
          onChangeValidity={(val: boolean) => setValidation((prev) => ({ ...prev, email: val }))}
          validate={['required', 'email', (value: any) => value.length > 6]}
          validationMessage={['Field is required', 'Email is invalid', 'Password is too short']}
          maxLength={30}
        />
        <AppTextField
          leadingAccessory={
            <MaterialIcons name="lock" size={24} color="black" style={{ marginRight: 4 }} />
          }
          placeholder={'Password'}
          floatingPlaceholder
          secureTextEntry
          onChangeText={(text: string) => setPassword(text)}
          onChangeValidity={(val: boolean) => setValidation((prev) => ({ ...prev, password: val }))}
          enableErrors
          validateOnBlur
          validate={['required', (value: any) => value.length > 4]}
          validationMessage={['Password is required', 'Password is too short']}
          maxLength={12}
        />
        <AppButton
          marginT-20
          label="Sign In"
          size={ButtonSize.large}
          disabled={loading || !isValid}
          onPress={() => signInWithEmail()}
        />
        <AppButton
          marginT-20
          label="Sign Up"
          size={ButtonSize.large}
          outline
          disabled={loading || !isValid}
          onPress={() => signUpWithEmail()}
        />
      </View>
    </View>
  );
}
