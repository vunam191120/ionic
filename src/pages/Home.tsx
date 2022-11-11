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
  IonRouterLink,
  IonSelect,
  IonSelectOption,
  IonText,
} from '@ionic/react';
import { useState } from 'react';
import { insertTrip } from '../databaseHandler';
import { Trip } from '../models/Trip';

import './Home.css';

const Home: React.FC = () => {
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
      };

      try {
        await insertTrip(newTrip);
        alert('Created new trip successfully!');
      } catch (err) {
        console.log(err);
      }
    }
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
          <IonTitle>i-Explore</IonTitle>
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

        <IonButton expand="block" class="ion-margin" onClick={saveHandler}>
          Save
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Home;
