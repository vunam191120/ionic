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
  IonImg,
  useIonToast,
  IonText,
  IonAlert,
} from '@ionic/react';
import { useState } from 'react';
import {
  checkmarkCircleOutline,
  closeCircleOutline,
  pencil,
  trash,
} from 'ionicons/icons';

import { deleteTrip, getAllTrips } from '../databaseHandler';
import { Trip } from '../models/Trip';
import { Link, useHistory } from 'react-router-dom';
import { isSignIn } from '../helpers/isSignedIn';
import { signOut } from '../helpers/signOut';

const ListTrip: React.FC = () => {
  const history = useHistory();
  const [alltrips, setAllTrips] = useState<Trip[]>([]);
  const [isShowAlert, setIsShowAlert] = useState(false);
  const [present] = useIonToast();
  const presentToast = (position: 'top', message: string, icon: any) => {
    present({
      message: message,
      duration: 3000,
      position: position,
      icon: icon ? icon : checkmarkCircleOutline,
    });
  };

  const fetchData = async () => {
    const data = await getAllTrips();
    setAllTrips(data);
  };

  useIonViewDidEnter(() => {
    fetchData();
    if (!isSignIn()) {
      presentToast('top', 'You have to sign in first!', closeCircleOutline);
      setTimeout(() => {
        history.push('/sign-in');
      }, 500);
    }
  });

  const handleDelete = async (id: number) => {
    await deleteTrip(id);
    fetchData();
    presentToast('top', 'Deleted trip successfully!', checkmarkCircleOutline);
    setIsShowAlert(false);
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
                <IonLabel className="label">
                  <b>Image</b>:{' '}
                  {
                    <IonImg
                      className="uploadImage"
                      class="preview-image-show"
                      src={trip.image}
                    />
                  }
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
                  onClick={() => setIsShowAlert(true)}
                  color="medium"
                  className="btn"
                  fill="solid"
                >
                  <IonIcon className="icon" icon={trash}></IonIcon>
                  Delete
                </IonButton>

                <IonAlert
                  isOpen={isShowAlert}
                  onDidDismiss={() => setIsShowAlert(false)}
                  header={'Confirm!'}
                  message={'Message <strong>text</strong>!!!'}
                  buttons={[
                    {
                      text: 'Cancel',
                      role: 'cancel',
                      cssClass: 'secondary',
                      handler: (blah) => {
                        setIsShowAlert(false);
                      },
                    },
                    {
                      text: 'Confirm',
                      handler: () => handleDelete(trip.id ? trip.id : 0),
                    },
                  ]}
                ></IonAlert>
              </IonButtons>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default ListTrip;
