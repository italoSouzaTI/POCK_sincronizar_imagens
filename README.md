# ![capa](./assets/icon.png)

O desevolvimento da POCK foi com estudos em banco de dados local sincronização de em segundo plano, notificação das sincronizações e modificação de
onde as fotos serão salvar fora do cache da camera.

#### Desenvolvimento das telas do aplicativo:

[Figma](https://www.figma.com/design/ulPqbVzlxDFhD4EypgyL3e/Sales?m=auto&t=crsHsVYIola8d2r9-1)

#### Tecnologias necessárias para rodar o projeto:

| Ferramenta   | Versão                         |
| ------------ | ------------------------------ |
| NodeJS (LTS) | v21.7.1                        |
| react-native | 0.74.5                         |
| EXPO         | ~51.0.28                       |
| Java         | openjdk 17.0.12 2024-07-16 LTS |

### Foi utilizado expo na sua versão SDK 51 com as respectivas bibliotecas:

-   [x] Zustand - Para controlar o estado da modal de sincronização.
-   [x] watermelondb - Como banco local.
-   [x] expo-notifications - Para notificar usuário da sincronização.
-   [x] expo-quick-actions - Foi um estudo, para ter a possibilidade de notificar a exclusão do app atraves do 3D Force.
-   [x] expo-task-manager - Utilizado para agendar a tarefa de sincronização.
-   [x] supabase/supabase-js - Utilizado como um backend para receber dados do device.

#### Melhorias do projeto futuras

-   [ ] Login no suparbase.
-   [ ] Listagem resgatando itens de cada usuário.
-   [ ] trabalhar sem conexão com internet.

## 🖥️Como utilizar projeto

```cm
git clone (link do repositório)
```

#### Instale as dependências

```cm
yarn
```

#### crie um .env na raiz do seu projeto

```cm
EXPO_PUBLIC_SUPARBASE_URL = sua credencial
EXPO_PUBLIC_API_KEXPO_PUBLIC_SUPARBASE_ANON_PUBLICEY = sua credencial
```

#### execute no android

```cm
yarn android
```

#### execute no ios

```cm
cd ios && pod install && cd..
yarn ios
```

[Linkedin](https://www.linkedin.com/in/italoasouzati/)
