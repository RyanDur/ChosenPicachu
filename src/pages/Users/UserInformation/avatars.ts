import {AvatarGenerator} from 'random-avatar-generator';

const generator = new AvatarGenerator();

export const drawAvatar = () => generator.generateRandomAvatar();

export const firstAvatar = 'https://avataaars.io/?accessoriesType=Round&avatarStyle=Circle&clotheColor=Black&clotheType=Hoodie&eyeType=Surprised&eyebrowType=SadConcernedNatural&facialHairColor=Black&facialHairType=BeardMagestic&hairColor=Auburn&hatColor=White&mouthType=Smile&skinColor=Black&topType=LongHairFroBand';
