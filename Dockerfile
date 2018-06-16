FROM node:8.9

MAINTAINER 15555140895@gmail.com

ENV HTTP_PORT 3000

COPY . /node_proxy
WORKDIR /node_proxy

RUN npm install --registry=http://registry.cnpmjs.org

EXPOSE 3000

CMD ["npm", "start"]
