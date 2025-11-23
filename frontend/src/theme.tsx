import { extendTheme } from "@chakra-ui/react";

const activeLabelStyles = {
  transform: "scale(0.85) translateY(-24px)"
};

export const theme = extendTheme({

  sizes: {
      header: "64px", // 🔑 altura del header
    },

  fonts: {
    heading: "'Nokora', sans-serif",
    body: "'Nokora', sans-serif",
  },

  fontWeight: {
    normal: '400',
    bold: '700',
  },

  fontSizes: {
    xs: "0.75rem",   // 12px
    sm: "0.875rem",  // 14px
    md: "1rem",      // 16px
    lg: "1.125rem",  // 18px
    xl: "1.25rem",   // 20px
    "2xl": "1.5rem", // 24px
    "3xl": "1.875rem", // 30px
    "4xl": "2.25rem", // 36px
    "5xl": "3rem",   // 48px
    "6xl": "3.75rem" // 60px
  },

  colors: {

    light:{

    text: {
      main: "#070807",
    },
    background: {
      main: "#f9fbf9",
      50: "#f0f5f0",
      100: "#e0ebe0",
      200: "#c2d6c2",
      300: "#a3c2a3",
      400: "#85ad85",
      500: "#669966",
      600: "#527a52",
      700: "#3d5c3d",
      800: "#293d29",
      900: "#141f14",
    },
    primary: {
      main: "#6ab856",
      50: "#eff7ed",
      100: "#dff0db",
      200: "#bfe1b7",
      300: "#a0d293",
      400: "#80c36f",
      500: "#60b44b",
      600: "#4d903c",
      700: "#3a6c2d",
      800: "#26481e",
      900: "#13240f",
    },
    secondary: {
      main: "#97dd88",
      50: "#eef9eb",
      100: "#dcf4d7",
      200: "#bae9af",
      300: "#97dd88",
      400: "#75d260",
      500: "#52c738",
      600: "#429f2d",
      700: "#317722",
      800: "#215016",
      900: "#10280b",
    },
    accent: {
      main: "#76e15b",
      50: "#edfbe9",
      100: "#dbf7d4",
      200: "#b7efa9",
      300: "#93e77e",
      400: "#6fdf53",
      500: "#4bd728",
      600: "#3cac20",
      700: "#2d8118",
      800: "#1e5610",
      900: "#0f2b08",
    },
  },

    dark:{
    text: {
      main: "#f7f8f7",
    },
    background: {
      main: "#040604",
      50: "#f0f5f0",
      100: "#e0ebe0",
      200: "#c2d6c2",
      300: "#a3c2a3",
      400: "#85ad85",
      500: "#669966",
      600: "#527a52",
      700: "#3d5c3d",
      800: "#293d29",
      900: "#141f14",
    },
    primary: {
      main: "#5aa947",
      50: "#eff7ed",
      100: "#dff0db",
      200: "#bfe1b7",
      300: "#a0d293",
      400: "#80c36f",
      500: "#60b44b",
      600: "#4d903c",
      700: "#3a6c2d",
      800: "#26481e",
      900: "#13240f",
    },
    secondary: {
      main: "#317722",
      50: "#eef9eb",
      100: "#dcf4d7",
      200: "#bae9af",
      300: "#97dd88",
      400: "#75d260",
      500: "#52c738",
      600: "#429f2d",
      700: "#317722",
      800: "#215016",
      900: "#10280b",
    },
    accent: {
      main: "#39a41e",
      50: "#edfbe9",
      100: "#dbf7d4",
      200: "#b7efa9",
      300: "#93e77e",
      400: "#6fdf53",
      500: "#4bd728",
      600: "#3cac20",
      700: "#2d8118",
      800: "#1e5610",
      900: "#0f2b08",
    },
  },


  semanticTokens: {
    colors: {
      // Text
      text: { default: "#0c1d12", _dark: "#e2f3e8" },

      // Background
      background: { default: "#edf7f1", _dark: "#08120c" },
      background50: { default: "#edf7f1", _dark: "#edf7f1" },
      background100: { default: "#dcefe4", _dark: "#dcefe4" },
      background200: { default: "#b9dfc8", _dark: "#b9dfc8" },
      background300: { default: "#95d0ad", _dark: "#95d0ad" },
      background400: { default: "#72c091", _dark: "#72c091" },
      background500: { default: "#4fb076", _dark: "#4fb076" },
      background600: { default: "#3f8d5e", _dark: "#3f8d5e" },
      background700: { default: "#2f6a47", _dark: "#2f6a47" },
      background800: { default: "#20462f", _dark: "#20462f" },
      background900: { default: "#102318", _dark: "#102318" },

      // Primary
      primary: { default: "#286742", _dark: "#98d7b2" },
      primary50: { default: "#edf8f1", _dark: "#edf8f1" },
      primary100: { default: "#daf1e4", _dark: "#daf1e4" },
      primary200: { default: "#b6e2c8", _dark: "#b6e2c8" },
      primary300: { default: "#91d4ad", _dark: "#91d4ad" },
      primary400: { default: "#6cc692", _dark: "#6cc692" },
      primary500: { default: "#47b876", _dark: "#47b876" },
      primary600: { default: "#39935f", _dark: "#39935f" },
      primary700: { default: "#2b6e47", _dark: "#2b6e47" },
      primary800: { default: "#1d492f", _dark: "#1d492f" },
      primary900: { default: "#0e2518", _dark: "#0e2518" },

      // Secondary
      secondary: { default: "#86d5a7", _dark: "#2a794b" },
      secondary50: { default: "#ecf8f1", _dark: "#ecf8f1" },
      secondary100: { default: "#d9f2e3", _dark: "#d9f2e3" },
      secondary200: { default: "#b4e4c8", _dark: "#b4e4c8" },
      secondary300: { default: "#8ed7ac", _dark: "#8ed7ac" },
      secondary400: { default: "#68ca91", _dark: "#68ca91" },
      secondary500: { default: "#42bd75", _dark: "#42bd75" },
      secondary600: { default: "#35975e", _dark: "#35975e" },
      secondary700: { default: "#287146", _dark: "#287146" },
      secondary800: { default: "#1b4b2f", _dark: "#1b4b2f" },
      secondary900: { default: "#0d2617", _dark: "#0d2617" },

      // Accent
      accent: { default: "#3dbd72", _dark: "#42c277" },
      accent50: { default: "#ecf9f1", _dark: "#ecf9f1" },
      accent100: { default: "#d8f3e3", _dark: "#d8f3e3" },
      accent200: { default: "#b2e6c8", _dark: "#b2e6c8" },
      accent300: { default: "#8bdaac", _dark: "#8bdaac" },
      accent400: { default: "#65cd90", _dark: "#65cd90" },
      accent500: { default: "#3ec175", _dark: "#3ec175" },
      accent600: { default: "#329a5d", _dark: "#329a5d" },
      accent700: { default: "#257446", _dark: "#257446" },
      accent800: { default: "#194d2f", _dark: "#194d2f" },
      accent900: { default: "#0c2717", _dark: "#0c2717" },
    },
  },


},


  components: {
    Form: {
      variants: {
        floating: {
          container: {
            _focusWithin: {
              label: {
                ...activeLabelStyles
              }
            },
            "input:not(:placeholder-shown) + label, .chakra-select__wrapper + label, textarea:not(:placeholder-shown) ~ label": {
              ...activeLabelStyles
            },
            label: {
              top: 0,
              left: 0,
              zIndex: 2,
              position: "absolute",
              backgroundColor: "white",
              pointerEvents: "none",
              mx: 3,
              px: 1,
              my: 2,
              transformOrigin: "left top"
            }
          }
        }
      }
    },

    Table: {
      variants: {
        simple: {
          th: {
            textTransform: "none",
          },
        },
      },
    },
  }
});

export default theme;