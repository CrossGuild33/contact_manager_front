# Usa um arquivo de imagem nginx como base
FROM nginx:alpine

# Copia o diretório do teu programa para o da nginx
COPY . /usr/share/nginx/html

# Porta aonde ira ser iniciado
EXPOSE 80

# Inicia o servidor nginx
CMD ["nginx", "-g", "daemon off;"]