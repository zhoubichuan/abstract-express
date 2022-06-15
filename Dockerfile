FROM node
COPY . /app																											
WORKDIR /app 																									
RUN npm install --registry=https://registry.npm.taobao.org
EXPOSE 4000																										
CMD [ "npm", "start"]																					
