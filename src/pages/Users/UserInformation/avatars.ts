import {AvatarGenerator} from 'random-avatar-generator';

const generator = new AvatarGenerator();

export const drawAvatar = () => generator.generateRandomAvatar();
