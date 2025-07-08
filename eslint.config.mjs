import globals from 'globals';
import tseslint from 'typescript-eslint';
import nextPlugin from '@next/eslint-plugin-next';
import reactPlugin from 'eslint-plugin-react';
import hooksPlugin from 'eslint-plugin-react-hooks';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';

export default tseslint.config(
  {
    // Aplica-se a todos os ficheiros
    files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
    
    // Configuração da linguagem e do parser
    languageOptions: {
      parser: tseslint.parser, // Usa o parser que entende TypeScript e JSX
      parserOptions: {
        ecmaFeatures: {
          jsx: true, // Ativa o suporte para JSX
        },
      },
      globals: {
        ...globals.browser, // Adiciona os globais do browser (window, document, etc.)
        React: 'readonly', // Define React como uma variável global
      },
    },

    // Plugins que estamos a usar
    plugins: {
      '@next/next': nextPlugin,
      'react': reactPlugin,
      'react-hooks': hooksPlugin,
      'jsx-a11y': jsxA11yPlugin,
    },

    // Regras
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      ...reactPlugin.configs.recommended.rules,
      ...hooksPlugin.configs.recommended.rules,
      ...jsxA11yPlugin.configs.recommended.rules,
      // Podes adicionar ou alterar regras aqui se quiseres
      // Exemplo para desligar a verificação de prop-types, se não usares:
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off', // Não é preciso com o novo JSX transform
    },
    
    // Configurações específicas dos plugins
    settings: {
      react: {
        version: 'detect', // Deteta automaticamente a versão do React
      },
    },
  }
);