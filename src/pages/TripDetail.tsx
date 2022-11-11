import {
  IonButton,
  IonContent,
  IonDatetime,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonPopover,
  IonSelect,
  IonSelectOption,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { getTripById, updateTrip } from '../databaseHandler';
import { Param } from '../models/Param';
import { Trip } from '../models/Trip';
import './TripDetail.css';

const TripDetail: React.FC = () => {
  const param: Param = useParams();
  const [emptyActivityName, setEmptyActivityName] = useState<boolean>(false);
  const [emptyDestination, setEmptyDesination] = useState<boolean>(false);
  const [emptyDescription, setEmptyDescription] = useState<boolean>(false);
  const [emptyDate, setEmptyDate] = useState<boolean>(false);
  const [risky, setRisky] = useState();
  const [trip, setTrip] = useState<Trip>({});

  useEffect(() => {
    const fetchTripById = async (id: number) => {
      const data = await getTripById(id);
      setTrip(data);
      setRisky(data.risky_assessment);
    };
    fetchTripById(+param.id);
  }, [param.id]);

  const dateSelectedHandler = (e: any) => {
    const selectedDate = new Date(e.detail.value);
    setTrip({
      ...trip,
      time: selectedDate.toLocaleTimeString(),
      date: selectedDate.toLocaleDateString('en-GB'),
    });
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

      updateNewTrip();
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>i-Explore</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
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

          <IonButton
            color="primary"
            class="ion-margin"
            fill="solid"
            onClick={handleUpdate}
          >
            Update
          </IonButton>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default TripDetail;
