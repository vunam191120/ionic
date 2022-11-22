import { Camera, CameraResultType } from '@capacitor/camera';
import {
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonDatetime,
  IonGrid,
  IonHeader,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonPopover,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonText,
  IonTitle,
  IonToolbar,
  useIonToast,
  useIonViewDidEnter,
} from '@ionic/react';
import { checkmarkCircleOutline, closeCircleOutline } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { getTripById, updateTrip } from '../databaseHandler';
import { isSignIn } from '../helpers/isSignedIn';
import { signOut } from '../helpers/signOut';
import { Param } from '../models/Param';
import { Trip } from '../models/Trip';
import './TripDetail.css';

const TripDetail: React.FC = () => {
  const history = useHistory();
  const param: Param = useParams();
  const [emptyActivityName, setEmptyActivityName] = useState<boolean>(false);
  const [emptyDestination, setEmptyDesination] = useState<boolean>(false);
  const [emptyDescription, setEmptyDescription] = useState<boolean>(false);
  const [emptyDate, setEmptyDate] = useState<boolean>(false);
  const [risky, setRisky] = useState();
  const [trip, setTrip] = useState<Trip>({});
  const [present] = useIonToast();
  const presentToast = (position: 'top', message: string, icon: any) => {
    present({
      message: message,
      duration: 3000,
      position: position,
      icon: icon ? icon : checkmarkCircleOutline,
    });
  };

  useEffect(() => {
    const fetchTripById = async (id: number) => {
      const data = await getTripById(id);
      setTrip(data);
      setRisky(data.risky_assessment);
    };
    fetchTripById(+param.id);
  }, [param.id]);

  useIonViewDidEnter(() => {
    if (!isSignIn()) {
      presentToast('top', 'You have to sign in first!', closeCircleOutline);
      setTimeout(() => {
        history.push('/sign-in');
      }, 500);
    }
  });

  const dateSelectedHandler = (e: any) => {
    const selectedDate = new Date(e.detail.value);
    setTrip({
      ...trip,
      time: selectedDate.toLocaleTimeString(),
      date: selectedDate.toLocaleDateString('en-GB'),
    });
  };

  const takePhoto = async () => {
    const image = Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
    });
    let image_url = `data:image/jpeg;base64,${(await image).base64String}`;
    setTrip({ ...trip, image: image_url });
  };

  const handleUpdate = () => {
    let valid = true;

    if (trip.activity_name === '') {
      valid = false;
      setEmptyActivityName(true);
    }

    if (trip.destination === '') {
      valid = false;
      setEmptyDesination(true);
    }

    if (trip.description === '') {
      valid = false;
      setEmptyDescription(true);
    }

    if (trip.date === '') {
      valid = false;
      setEmptyDate(true);
    }

    if (valid) {
      const updateNewTrip = async () => {
        await updateTrip(trip);
      };

      try {
        updateNewTrip();
        presentToast(
          'top',
          `Updated trip successfully!`,
          checkmarkCircleOutline
        );
        // history.push('/trips');
        console.log(trip);
      } catch (err) {
        presentToast('top', `Update failed!`, closeCircleOutline);
      }
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>M-Expense</IonTitle>
          <IonButtons slot="end">
            <IonText>
              <IonLabel>Hello admin@gmail.com , </IonLabel>
              <Link to="/sign-in" className="signout-btn" onClick={signOut}>
                sign out!
              </Link>
            </IonText>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <h1 className="link-btn">Trip Detail</h1>

        <IonList>
          {/* Reporter Name */}
          <IonItem>
            <IonLabel position="floating">Reporter name</IonLabel>
            <IonInput
              value={trip.reporter_name}
              onIonChange={(e) => {
                const newReporterName =
                  e.detail.value !== null ? e.detail.value : '';
                setTrip({ ...trip, reporter_name: newReporterName });
              }}
              placeholder="Enter reporter name"
            ></IonInput>
          </IonItem>

          {/* Activity Name */}
          <IonItem>
            <IonLabel position="floating">Activity name</IonLabel>
            <IonInput
              value={trip.activity_name}
              onIonChange={(e) => {
                const newActivityName =
                  e.detail.value !== null ? e.detail.value : '';
                setTrip({ ...trip, activity_name: newActivityName });
              }}
              placeholder="Enter reporter name"
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
              value={trip.destination}
              onIonChange={(e) => {
                const newDestination =
                  e.detail.value !== null ? e.detail.value : '';
                setTrip({ ...trip, destination: newDestination });
              }}
              placeholder="Enter your destination"
            ></IonInput>
            <IonText
              className={`text-error ${emptyDestination ? 'active' : ''}`}
            >
              Please enter your destination!
            </IonText>
          </IonItem>

          {/* Description */}
          <IonItem>
            <IonLabel position="floating">Description</IonLabel>
            <IonInput
              value={trip.description}
              onIonChange={(e) => {
                const newDescription =
                  e.detail.value !== null ? e.detail.value : '';
                setTrip({ ...trip, description: newDescription });
              }}
              placeholder="Enter description"
            ></IonInput>
            <IonText
              className={`text-error ${emptyDescription ? 'active' : ''}`}
            >
              Please enter your description!
            </IonText>
          </IonItem>

          {/* Date */}
          <IonItem>
            <IonLabel position="floating">Date and Time</IonLabel>
            <IonInput value={trip.date} id="tripDetailDate"></IonInput>
            <IonPopover
              keepContentsMounted={true}
              trigger="tripDetailDate"
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
                value={risky}
                placeholder="Select risky assessment"
                onIonChange={(e) => setRisky(e.detail.value)}
              >
                <IonSelectOption value="Easy">Easy</IonSelectOption>
                <IonSelectOption value="Medium">Medium</IonSelectOption>
                <IonSelectOption value="Hard">Hard</IonSelectOption>
              </IonSelect>
              <IonText className="text-error risky">
                Please enter your risky assessment!
              </IonText>
            </IonItem>
          </IonList>

          {/* Image */}
          <IonItem>
            <IonText>Image</IonText>
            {/* Preview Image */}
            {trip.image && (
              <IonItem>
                <IonImg
                  className="uploadImage"
                  class="preview-image"
                  src={trip.image}
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
            {trip.image && (
              <IonButton
                expand="block"
                class="ion-margin"
                onClick={() => setTrip({ ...trip, image: '' })}
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
                    Cancel
                  </Link>
                </IonButton>

                {/* Save */}
                <IonButton
                  class="ion-margin"
                  color="primary"
                  onClick={handleUpdate}
                >
                  Update
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default TripDetail;
