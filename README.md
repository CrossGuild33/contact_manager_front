#  Administrador de Contatos 
 

Este projeto é um MVP feito para o modulo desenvolvimento Full-stack basico da PUC-RJ
_____

Como executar
1. Basta fazer o download do projeto e abrir o arquivo index.html no seu browser.
______
2. Ou instale e execute a extensão Live Server.
______
### Para rodar o Dockerfile

1. Instale o Docker em sua máquina
2. Depois utilize o comando `docker build -t (nome do container) .` para criar o container.
3. E por fim para rodar `docker run -d --name (nome do container) --network (nome da network) -p 5000:5000 (nome da container image)`
    1. Talvez seja necessário criar o network para integrar o front e o back.
    2. Utilize este comando para a criação do network `docker network create (nome da network)`

 <img src="/_Fluxograma.jpeg ">
