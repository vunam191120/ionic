import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
  useIonToast,
} from '@ionic/react';
import { checkmarkCircleOutline, closeCircleOutline } from 'ionicons/icons';
import { useState } from 'react';
import './SignIn.css';

const SignIn: React.FC = () => {
  const [emptyEmail, setEmptyEmail] = useState<boolean>(false);
  const [emptyPassword, setEmptyPassword] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const [success] = useIonToast();
  const [fail] = useIonToast();
  const signInSuccessToast = (position: 'top') => {
    success({
      message: 'Signed in successfully!',
      duration: 3000,
      position: position,
      icon: checkmarkCircleOutline,
    });
  };
  const signInFailToast = (position: 'top') => {
    fail({
      message: 'Email or password incorrect, please try again!',
      duration: 3000,
      position: position,
      icon: closeCircleOutline,
    });
  };

  const handleSignIn = () => {
    let valid = true;

    // Email
    if (email === '') {
      valid = false;
      setEmptyEmail(true);
    }

    // Password
    if (password === '') {
      valid = false;
      setEmptyPassword(true);
    }

    if (valid) {
      setEmptyEmail(false);
      setEmptyPassword(false);

      // const fetchUser = async (id: number) => {
      //   const result = await signIn(id);
      //   return result;
      // };
      // const verifiedUser = fetchUser(1);
      const correctUser = {
        email: 'admin@gmail.com',
        password: '123456',
      };
      if (
        JSON.stringify(correctUser) ===
        JSON.stringify({
          email,
          password,
        })
      ) {
        localStorage.setItem(
          'currentUser',
          JSON.stringify({
            email: 'admin@gmail.com',
            password: '123456',
          })
        );
        signInSuccessToast('top');
        window.location.href = '/home';
      } else {
        signInFailToast('top');
      }
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>M-Expense</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <h1 className="link-btn">Sign In Page</h1>
        <IonList>
          {/* Email */}
          <IonItem>
            <IonLabel position="floating">Email</IonLabel>
            <IonInput
              type="email"
              value={email}
              onIonChange={(e) =>
                setEmail(e.detail.value ? e.detail.value : '')
              }
              placeholder="email@gmail.com"
            ></IonInput>
            <IonText className={`text-error ${emptyEmail ? 'active' : ''}`}>
              Please enter your email!
            </IonText>
          </IonItem>

          {/* Password */}
          <IonItem>
            <IonLabel position="floating">Password</IonLabel>
            <IonInput
              type="password"
              value={password}
              onIonChange={(e) =>
                setPassword(e.detail.value ? e.detail.value : '')
              }
              placeholder="*******"
            ></IonInput>
            <IonText className={`text-error ${emptyPassword ? 'active' : ''}`}>
              Please enter your password!
            </IonText>
          </IonItem>
        </IonList>

        <IonGrid>
          <IonRow>
            <IonCol size="12" class="ion-text-center">
              {/* Save */}
              <IonButton
                class="ion-margin"
                color="primary"
                onClick={handleSignIn}
              >
                Sign In
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>

        <IonText class="show-account">
          <strong>Email</strong>: admin@gmail.com - <strong>Password</strong>:
          123456
        </IonText>
      </IonContent>
    </IonPage>
  );
};

export default SignIn;
