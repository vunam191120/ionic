import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonRouterLink,
  IonList,
  IonItem,
  IonLabel,
  IonButtons,
  IonButton,
  IonIcon,
  useIonViewDidEnter,
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { pencil, trash } from 'ionicons/icons';

import { deleteTrip, getAllTrips } from '../databaseHandler';
import { Trip } from '../models/Trip';

const ListTrip: React.FC = () => {
  const [alltrips, setAllTrips] = useState<Trip[]>([]);

  const fetchData = async () => {
    const data = await getAllTrips();
    setAllTrips(data);
  };

  useIonViewDidEnter(() => {
    fetchData();
  });

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = (id: number) => {
    const result = deleteTrip(id);
    fetchData();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>i-Explore</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <h1 className="link-btn">List Trip Page</h1>
        <IonList>
          {alltrips.map((trip) => (
            <IonItem key={trip.id} className="item">
              <IonLabel>
                <IonLabel className="label">
                  <b>Reporter Name</b>: {trip.reporter_name}
                </IonLabel>
                <IonLabel className="label">
                  <b>Activity Name</b>: {trip.activity_name}
                </IonLabel>
                <IonLabel className="label">
                  <b>Destination</b>: {trip.destination}
                </IonLabel>
                <IonLabel className="label">
                  <b>Description</b>: {trip.description}
                </IonLabel>
                <IonLabel className="label">
                  <b>Risky Assessment</b>: {trip.risky_assessment}
                </IonLabel>
                <IonLabel className="label">
                  <b>Date</b>: {trip.date}
                </IonLabel>
                <IonLabel className="label">
                  <b>Time</b>: {trip.time}
                </IonLabel>
              </IonLabel>
              <IonButtons slot="end">
                <IonRouterLink routerLink={`/detail/${trip.id}`}>
                  <IonButton color="primary" className="btn" fill="solid">
                    <IonIcon className="icon" icon={pencil}></IonIcon>
                    Update
                  </IonButton>
                </IonRouterLink>

                <IonButton
                  onClick={() => handleDelete(trip.id ? trip.id : 0)}
                  color="medium"
                  className="btn"
                  fill="solid"
                >
                  <IonIcon className="icon" icon={trash}></IonIcon>
                  Delete
                </IonButton>
              </IonButtons>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default ListTrip;
