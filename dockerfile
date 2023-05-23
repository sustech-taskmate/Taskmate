FROM debian as os
SHELL ["/bin/bash", "-ic"]
RUN apt update
RUN apt install -y libwebkit2gtk-4.0-dev \
    build-essential \
    curl \
    wget \
    libssl-dev \
    libgtk-3-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev
# ENV HTTPS_PROXY="http://192.168.110.131:7890"
RUN wget -qO- https://get.pnpm.io/install.sh | ENV="$HOME/.bashrc" SHELL="$(which bash)" bash -
RUN curl https://sh.rustup.rs -sSf | bash -s -- -y
RUN cargo install tauri-cli --git https://github.com/tauri-apps/tauri
RUN pnpm env use --global 18

FROM os as builder
SHELL ["/bin/bash", "-ic"]

WORKDIR /home/node

COPY --chown=node:node . .
RUN pnpm install

CMD [ "/bin/bash" ]
