
import { createMMKV } from 'react-native-mmkv'
import environment from '../environment';

export const USER_STORAGE='creds'

export const storage = createMMKV({
  id: `user-storage`,
//   path: `/mk-codely`,
  encryptionKey: environment.secretkey,
  mode: 'multi-process',
  readOnly: false
})
// export const storage = createMMKV()

export const setUserStorage=(data:any)=>{
    storage.set(USER_STORAGE, JSON.stringify(data));
}

export const deleteUserStorage=()=>{
    storage.remove(USER_STORAGE)
}

export function getUserStorage(){
    const user = storage.getString(USER_STORAGE);
    return user?JSON.parse(user):null
}