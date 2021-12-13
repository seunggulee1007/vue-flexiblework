node {
    try {
        stage('Start') {
            slackSend (channel: '#jenkins', color: '#FFFF00', message: "STARTED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})")
        }
        stage('git source Pull') {
            checkout scm
        }

        stage("Docker Image Delete") {
            sh(script: "docker rmi ${IMAGE_NAME} || true")
        }

        stage("Docker Image build") {
            sh(script: "docker build -t ${IMAGE_NAME}:latest .")
        }

        stage("Docker Image tag") {
            sh(script: "docker tag ${IMAGE_NAME}:latest ${HARBOR_URL}/${HARBOR_PROJECT}/${IMAGE_NAME}:latest")
        }

        stage("Docker Image Push") {
            withDockerRegistry(credentialsId: 'harbor_docker_repository', url: 'https://dist.sckcorp.co.kr') {
                // some block
                sh "docker push ${HARBOR_URL}/${HARBOR_PROJECT}/${IMAGE_NAME}:latest"
            }
        }
        
        stage("Docker Pushed Image delete") {
            sh(script: 'docker rmi ${HARBOR_URL}/${HARBOR_PROJECT}/${IMAGE_NAME}:latest || true')
        }
        
        def remote = [:]
        remote.name = "${SSH_USER}"
        remote.user = "${SSH_USER}"
        remote.host = "${SSH_HOST}"
        remote.password = "${SSH_PASSWORD}"
        remote.allowAnyHosts = true
        stage("SSH Docker Image Pull") { 
            sshCommand remote: remote, command: "sudo docker login https://${HARBOR_URL} -u ${HARBOR_USER} -p ${HARBOR_PWD}"
            sshCommand remote: remote, command: "sudo docker stop ${IMAGE_NAME} || true"
            sshCommand remote: remote, command: "sudo docker rm ${IMAGE_NAME} || true"
            sshCommand remote: remote, command: "sudo docker rmi ${HARBOR_URL}/${HARBOR_PROJECT}/${IMAGE_NAME} || true"
            sshCommand remote: remote, command: "sudo docker run --network sctek-bridge -d --name ${IMAGE_NAME} -v /app/node_modules -v /app:/app ${HARBOR_URL}/${HARBOR_PROJECT}/${IMAGE_NAME}:latest"
        }
        slackSend (channel: '#jenkins', color: '#00FF00', message: "SUCCESSFUL: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})")
    }catch(e) {
        slackSend (channel: '#jenkins', color: '#FF0000', message: "FAILED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})")
    }
}