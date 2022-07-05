import { extendTheme, theme as DEFAULT_THEME } from '@chakra-ui/react';

const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  fonts: {
    heading: 'Poppins',
    body: 'Poppins',
  },
  colors: {
    gray: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#E5E5E5',
      300: '#D4D4D4',
      400: '#A3A3A3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
    },
  },
  styles: {
    global: {
      body: {
        backgroundColor: 'black',
      },
    },
  },
  components: {
    Avatar: {
      baseStyle: {
        container: {
          bgGradient: 'linear(to-r, purple.300, purple.300)',
        },
      },
    },
    Textarea: {
      defaultProps: {
        focusBorderColor: 'purple.500',
      },
    },
    Spinner: {
      baseStyle: {
        color: 'purple.400',
      },
    },
  },
  shadows: {
    outline: '0 0 0 3px var(--chakra-colors-purple-600) !important',
  },
});

export default theme;
