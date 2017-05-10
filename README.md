# n4translate
i18n angular distributing web service

# Client configuration
## [Assing production apiUrl](https://github.com/n4group/n4translate/blob/master/client/src/environments/environment.prod.ts)

# Server configuration
## [Insert default user into db by:](https://github.com/n4group/n4translate/tree/master/server)
Create a file 'default.user.json' with content similar to 'default.user.example.json', so a initial user can be created on an initial deploy.

#Deployment
- go to [client](https://github.com/n4group/n4translate/tree/master/client) - execute 'ng build --aot'
- go to [server](https://github.com/n4group/n4translate/tree/master/server) - execute 'npm start prod'
