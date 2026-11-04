import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';
import { withUniwind } from 'uniwind';

/**
 * `LinearGradient` de Expo con soporte para `className`.
 * Uniwind solo transforma componentes de React Native; los de terceros se
 * envuelven una vez con `withUniwind`.
 */
export const AppGradient = withUniwind(ExpoLinearGradient);
