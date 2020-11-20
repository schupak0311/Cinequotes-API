import { Firestore } from '@google-cloud/firestore';

const firestore = new Firestore({
  projectId: 'dummy' // projectId doesn’t matter while using the emulator
});

export default firestore;
