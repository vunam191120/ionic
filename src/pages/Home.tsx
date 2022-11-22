import {
  IonContent,
  IonDatetime,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonPopover,
  IonTitle,
  IonToolbar,
  IonButton,
  IonList,
  IonSelect,
  IonSelectOption,
  IonText,
  IonImg,
  IonGrid,
  IonCol,
  IonRow,
  useIonToast,
  IonButtons,
  useIonViewDidEnter,
} from '@ionic/react';
import { Camera, CameraResultType } from '@capacitor/camera';
import { useState } from 'react';
import { insertTrip } from '../databaseHandler';
import { Trip } from '../models/Trip';

import './Home.css';
import { Link, useHistory } from 'react-router-dom';
import { checkmarkCircleOutline, closeCircleOutline } from 'ionicons/icons';
import { isSignIn } from '../helpers/isSignedIn';
import { signOut } from '../helpers/signOut';

const Home: React.FC = () => {
  const history = useHistory();
  const [emptyActivityName, setEmptyActivityName] = useState<boolean>(false);
  const [emptyDestination, setEmptyDesination] = useState<boolean>(false);
  const [emptyDescription, setEmptyDescription] = useState<boolean>(false);
  const [emptyDate, setEmptyDate] = useState<boolean>(false);
  const [activityName, setActivityName] = useState<string>('');
  const [reporterName, setReporterName] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  const [riskyAssessment, setRiskyAssessment] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [tripDate, setTripDate] = useState<string>('');
  const [tripTime, setTripTime] = useState<string>();
  const [image, setImage] = useState<string>('');

  const [present] = useIonToast();
  const presentToast = (position: 'top', message: string, icon: any) => {
    present({
      message: message,
      duration: 3000,
      position: position,
      icon: icon ? icon : checkmarkCircleOutline,
    });
  };

  useIonViewDidEnter(() => {
    if (!isSignIn()) {
      presentToast('top', 'You have to sign in first!', closeCircleOutline);
      setTimeout(() => {
        history.push('/sign-in');
      }, 500);
    }
  });

  const saveHandler = async () => {
    let valid = true;

    // Activity Name
    if (activityName === '') {
      valid = false;
      setEmptyActivityName(true);
    }

    // Destination
    if (destination === '') {
      valid = false;
      setEmptyDesination(true);
    }

    // Description
    if (description === '') {
      valid = false;
      setEmptyDescription(true);
    }

    // Date
    if (tripDate === '') {
      valid = false;
      setEmptyDate(true);
    }

    if (valid) {
      setEmptyActivityName(false);
      setEmptyDesination(false);
      setEmptyDescription(false);
      setEmptyDate(false);

      const newTrip: Trip = {
        reporter_name: reporterName,
        activity_name: activityName,
        destination: destination,
        description: description,
        risky_assessment: riskyAssessment,
        date: tripDate,
        time: tripTime,
        image: image,
      };

      try {
        await insertTrip(newTrip);
        presentToast(
          'top',
          `Created new trip successfully!
      ${activityName} created by ${reporterName} held at ${destination}`,
          checkmarkCircleOutline
        );
      } catch (err) {
        console.log(err);
      }
    }
  };

  const takePhoto = async () => {
    const image = Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
    });
    let image_url = `data:image/jpeg;base64,${(await image).base64String}`;
    setImage(image_url);
  };

  const dateSelectedHandler = (e: any) => {
    const selectedDate = new Date(e.detail.value);
    setTripTime(selectedDate.toLocaleTimeString());
    setTripDate(selectedDate.toLocaleDateString('en-GB'));
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>M-Expense</IonTitle>
          <IonButtons slot="end">
            {!isSignIn() ? (
              <IonButton>
                <Link to="/sign-in" className="signout-btn" onClick={signOut}>
                  Sign In
                </Link>
              </IonButton>
            ) : (
              <IonText>
                <IonLabel>Hello admin@gmail.com , </IonLabel>
                <Link to="/sign-in" className="signout-btn" onClick={signOut}>
                  sign out!
                </Link>
              </IonText>
            )}
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {/* Reporter Name */}
        <IonItem>
          <IonLabel position="floating">Reporter Name</IonLabel>
          <IonInput
            onIonChange={(e) => setReporterName(e.detail.value!)}
          ></IonInput>
        </IonItem>

        {/* Activity Name */}
        <IonItem>
          <IonLabel position="floating">Activity Name</IonLabel>
          <IonInput
            onIonChange={(e) => setActivityName(e.detail.value!)}
          ></IonInput>
          <IonText
            className={`text-error ${emptyActivityName ? 'active' : ''}`}
          >
            Please enter your activity name!
          </IonText>
        </IonItem>

        {/* Destination */}
        <IonItem>
          <IonLabel position="floating">Destination</IonLabel>
          <IonInput
            onIonChange={(e) => setDestination(e.detail.value!)}
          ></IonInput>
          <IonText className={`text-error ${emptyDestination ? 'active' : ''}`}>
            Please enter your destination!
          </IonText>
        </IonItem>

        {/* Description */}
        <IonItem>
          <IonLabel position="floating">Description</IonLabel>
          <IonInput
            onIonChange={(e) => setDescription(e.detail.value!)}
          ></IonInput>
          <IonText className={`text-error ${emptyDescription ? 'active' : ''}`}>
            Please enter your description!
          </IonText>
        </IonItem>

        {/* Date */}
        <IonItem>
          <IonLabel position="floating">Date and Time</IonLabel>
          <IonInput value={tripDate} id="tripDate"></IonInput>
          <IonPopover
            keepContentsMounted={true}
            trigger="tripDate"
            triggerAction="click"
          >
            <IonDatetime onIonChange={(e) => dateSelectedHandler(e)}>
              {' '}
            </IonDatetime>
          </IonPopover>
          <IonText className={`text-error ${emptyDate ? 'active' : ''}`}>
            Please select your date and time!
          </IonText>
        </IonItem>

        {/* Risky Assessment */}
        <IonList>
          <IonItem>
            <IonLabel position="floating">Risky Assessment</IonLabel>
            <IonSelect
              placeholder="Select risky assessment"
              onIonChange={(e) => setRiskyAssessment(e.detail.value)}
            >
              <IonSelectOption value="Easy">Easy</IonSelectOption>
              <IonSelectOption value="Medium">Medium</IonSelectOption>
              <IonSelectOption value="Hard">Hard</IonSelectOption>
            </IonSelect>
          </IonItem>
        </IonList>

        {/* Image */}
        <IonItem>
          <IonText>Image</IonText>
          {/* Preview Image */}
          {image && (
            <IonItem>
              <IonImg
                className="uploadImage"
                class="preview-image"
                src={image}
              />
            </IonItem>
          )}
          <IonButton
            expand="block"
            class="ion-margin"
            onClick={() => takePhoto()}
          >
            Choose
          </IonButton>
          {image && (
            <IonButton
              expand="block"
              class="ion-margin"
              onClick={() => setImage('')}
            >
              Delete
            </IonButton>
          )}
        </IonItem>

        <IonGrid>
          <IonRow>
            <IonCol size="12" class="ion-text-center">
              {/* Cancel */}
              <IonButton class="ion-margin" color="light">
                <Link to="/trips" color="light" className="buttonLink">
                  View List Trip
                </Link>
              </IonButton>

              {/* Save */}
              <IonButton
                class="ion-margin"
                color="primary"
                onClick={saveHandler}
              >
                Save
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Home;
