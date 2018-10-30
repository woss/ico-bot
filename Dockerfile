# Step 1 : Builder image
#
FROM node:5-wheezy AS builder

RUN apt-get update && apt-get install -y build-essential sqlite3

# Define working directory and copy source
WORKDIR /app
COPY . .

# RUN npm install
RUN npm install --unsafe-perm -g sqlite
RUN npm install


###############################################################################
# Step 2 : Run image
#

FROM node:5-wheezy

# VOLUME [ "/app" ]

WORKDIR /app

ADD . .
# Copy builded source from the upper builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package* ./
# COPY --from=builder /app/yarn* ./

EXPOSE 8088

ENTRYPOINT [ "node" ]
