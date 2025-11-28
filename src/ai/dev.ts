import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-treatments-for-detected-disease.ts';
import '@/ai/flows/analyze-plant-image-and-detect-disease.ts';