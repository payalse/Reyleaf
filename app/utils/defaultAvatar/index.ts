import AsyncStorage from '@react-native-async-storage/async-storage';

export type AvatarDefaultType = {
  id: number;
  title: string;
  img: any;
  isDefaultAvatar: true;
};
export const AvatarList: AvatarDefaultType[] = [
  {id: 0, isDefaultAvatar: true, title: 'Select image', img: null},
  {
    id: 1,
    isDefaultAvatar: true,
    title: 'Avatar 1',
    img: require('../../../assets/img/avatar/a1.png'),
  },
  {
    id: 2,
    isDefaultAvatar: true,
    title: 'Avatar 2',
    img: require('../../../assets/img/avatar/a2.png'),
  },
  {
    id: 3,
    isDefaultAvatar: true,
    title: 'Avatar 3',
    img: require('../../../assets/img/avatar/a3.png'),
  },
  {
    id: 4,
    isDefaultAvatar: true,
    title: 'Avatar 4',
    img: require('../../../assets/img/avatar/a4.png'),
  },
  {
    id: 5,
    isDefaultAvatar: true,
    title: 'Avatar 5',
    img: require('../../../assets/img/avatar/a5.png'),
  },
  {
    id: 6,
    isDefaultAvatar: true,
    title: 'Avatar 6',
    img: require('../../../assets/img/avatar/a6.png'),
  },
  {
    id: 7,
    isDefaultAvatar: true,
    title: 'Avatar 7',
    img: require('../../../assets/img/avatar/a7.png'),
  },
  {
    id: 8,
    isDefaultAvatar: true,
    title: 'Avatar 8',
    img: require('../../../assets/img/avatar/a8.png'),
  },
];
class DefaultAvatarClass {
  private list = AvatarList;
  getList() {
    return this.list;
  }
  saveToLocal(item: AvatarDefaultType) {
    AsyncStorage.setItem('defaultAvatar', JSON.stringify(item));
    console.log('saveToLocal', item.id);
  }
  getImgById(id: number) {
    return this.list.find(i => i.id === id) || null;
  }
  async getDefaultAvatarFromLocal(): Promise<null | AvatarDefaultType> {
    try {
      const res = await AsyncStorage.getItem('defaultAvatar');
      if (res !== null) {
        return JSON.parse(res) as AvatarDefaultType;
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

const DefaultAvatar = new DefaultAvatarClass();

export {DefaultAvatar};
