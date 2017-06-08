# n4translate
Web application for managing i18n translations of an Angular application.

# Client configuration
## [Setting production apiUrl into production environment](https://github.com/n4group/n4translate/blob/master/client/src/environments/environment.prod.ts)

# Server configuration
## [Insert default user into DB](https://github.com/n4group/n4translate/tree/master/server)
Create a file 'default.user.json' with content similar to 'default.user.example.json', so a initial user can be created on an initial deploy.

# Deployment
- go to [client](https://github.com/n4group/n4translate/tree/master/client) - execute 'ng build --prod --aot'
- [deploy generated app](https://github.com/n4group/n4translate/tree/master/client) - execute 'node index.js'
- go to [server](https://github.com/n4group/n4translate/tree/master/server) - execute 'npm start prod'
