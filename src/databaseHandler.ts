import { openDB } from 'idb';
import { Trip } from './models/Trip';

const DATABASE_NAME = 'TripDB';

export async function insertTrip(tripInfo: Trip) {
  const db = await openDB(DATABASE_NAME, 1);
  const id = await db.add('trips', tripInfo);
  return id;
}

export async function getAllTrips() {
  const db = await openDB(DATABASE_NAME, 1);
  const result = await db.getAll('trips');
  return result;
}

export async function getTripById(id: number) {
  const db = await openDB(DATABASE_NAME, 1);
  return await db.get('trips', id);
}

export async function signIn(id: number = 1) {
  const db = await openDB(DATABASE_NAME);
  return await db.get('users', id);
}

export async function updateTrip(tripInfo: Trip) {
  const db = await openDB(DATABASE_NAME, 1);
  const id = await db.put('trips', tripInfo);
  return id;
}

export async function deleteTrip(id: number) {
  const db = await openDB(DATABASE_NAME, 1);
  const result = await db.delete('trips', id);
  return result;
}

initDB().then(() => {
  console.log('database created!');
});

async function initDB() {
  const db = await openDB(DATABASE_NAME, 1, {
    upgrade(db) {
      const store = db.createObjectStore('trips', {
        keyPath: 'id',
        autoIncrement: true,
      });
      // const userStore = db.createObjectStore('users', {
      //   keyPath: 'id',
      //   autoIncrement: true,
      // });
    },
  });
}
