import PocketBase from 'pocketbase';

const pbUrl = import.meta.env.VITE_POCKETBASE_URL || 'https://urbano.noweb.tech';

export const pb = new PocketBase(pbUrl);

// Enable auto cancellation for multiple fast requests if needed (false is safer for react components)
pb.autoCancellation(false);

export default pb;
