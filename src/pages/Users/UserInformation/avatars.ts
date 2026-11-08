import {AvatarGenerator} from 'random-avatar-generator';

const generator = new AvatarGenerator();

type Avatars = {
  drawn: () => string;
  first: string;
};

export const avatars: Avatars = {
  drawn: () => generator.generateRandomAvatar(),
  first: 'https://avataaars.io/?accessoriesType=Round&avatarStyle=Circle&clotheColor=Black&clotheType=Hoodie&eyeType=Surprised&eyebrowType=SadConcernedNatural&facialHairColor=Black&facialHairType=BeardMagestic&hairColor=Auburn&hatColor=White&mouthType=Smile&skinColor=Black&topType=LongHairFroBand'
};
