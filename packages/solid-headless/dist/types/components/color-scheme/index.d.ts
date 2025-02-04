import { JSX } from 'solid-js';
export type NativeColorScheme = 'light' | 'dark';
export type ColorScheme = NativeColorScheme | 'system';
export interface ColorSchemeProviderControlledProps {
    value: ColorScheme;
    onChange?: (scheme: ColorScheme) => void;
    children?: JSX.Element;
}
export interface ColorSchemeProviderUncontrolledProps {
    initialValue: ColorScheme;
    onChange?: (scheme: ColorScheme) => void;
    children?: JSX.Element;
}
export type ColorSchemeProviderProps = ColorSchemeProviderControlledProps | ColorSchemeProviderUncontrolledProps;
export declare function ColorSchemeProvider(props: ColorSchemeProviderProps): JSX.Element;
export declare function useColorScheme(): [() => ColorScheme, (newScheme: ColorScheme) => void];
export declare function useNativeColorScheme(): () => NativeColorScheme;
export declare function usePreferredColorScheme(): () => NativeColorScheme;
