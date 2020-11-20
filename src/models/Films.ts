import { FirestoreRepository } from '../repository/FirebaseRepository';

const filmsRepository = new FirestoreRepository();
filmsRepository.setCollection('films');

export default filmsRepository;
