export type AvatarLayerType = 'body' | 'head' | 'face' | 'hairs' | 'accessory';

export const AVATAR_LAYER_ORDER: AvatarLayerType[] = ['body', 'head', 'face', 'hairs', 'accessory'];

export const OPTIONAL_AVATAR_LAYERS: AvatarLayerType[] = ['hairs', 'accessory'];

export const AVATAR_LAYER_LABELS: Record<AvatarLayerType, string> = {
  body: 'Corps',
  head: 'Tête',
  face: 'Visage',
  hairs: 'Pilosité',
  accessory: 'Accessoire',
};

export interface AvatarConfig {
  body: string;
  head: string;
  face: string;
  hairs?: string;
  accessory?: string;
}
