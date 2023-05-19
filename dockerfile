FROM debian as os
SHELL ["/bin/bash", "-c"]

RUN apt update
RUN apt install -y libwebkit2gtk-4.0-dev \
    build-essential \
    curl \
    wget \
    libssl-dev \
    libgtk-3-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev
RUN touch "$HOME/.bashrc"
RUN wget -qO- https://get.pnpm.io/install.sh | ENV="$HOME/.bashrc" SHELL="$(which bash)" HTTPS_PROXY="http://192.168.110.131:7890" bash -
RUN HTTPS_PROXY="http://192.168.110.131:7890" curl https://sh.rustup.rs -sSf | bash -s -- -y

FROM os as node
RUN source "$HOME/.bashrc" && pnpm env use --global 18

FROM node as builder
SHELL ["/bin/bash", "-c"]

WORKDIR /home/node

# pnpm fetch does require only lockfile
COPY pnpm-lock.yaml ./

RUN source "$HOME/.bashrc" && pnpm fetch --registry https://registry.npm.taobao.org

COPY --chown=node:node . .
RUN source "$HOME/.bashrc" && pnpm install -r --offline
RUN source "$HOME/.bashrc" && pnpm tauri build