pipeline {
  environment {
    registry = '' // TO UPDATE - Using Google Artifact Registry API
    dockerHubCreds = 'docker_hub' // TO CHANGE - Using Google Artifact Registry API
    dockerImage = '' // TO UPDATE - Using Google Artifact Registry API
    REGISTRY_LOCATION = 'us-central1'
    REPOSITORY = 'project-3'
    PROJECT_ID = 'devopssre-346918'
    scannerHome = tool 'SonarQubeScanner'

  }
  agent any
  stages {
    stage('Code Analysis') {
      steps {
        withSonarQubeEnv('SonarCloud') {
          sh "${scannerHome}/bin/sonar-scanner -Dsonar.projectKey=reverse-angular -Dsonar.organization=revature-reverse-project"
        }
      }
    }
    stage('Testing') {
        when {
            anyOf {branch 'ft_*'; branch 'bg_*'}
        }
        steps {
            echo 'Testing stage'
            sh 'ng test'
        }
    }
    stage('Build') {
        when {
            // branch 'master'
            // branch 'ft_jenkins'
            branch 'ft_*'
        }
        steps{
            echo 'Build stage'
            // TO UPDATE - NOT MAVEN
            // withMaven {
            //     sh 'mvn package -DskipTests'
            // }
        }
    }
    stage('Docker Image') {
        when {
            anyOf {branch 'ft_*'; branch 'master'}
        }
        steps{
            script {
                echo 'Docker Image stage'
                sh "docker build -t reverse-angular ."
            }
        }
    }
    stage('Docker Deliver to Artifact Registry') {
        when {
            anyOf {branch 'ft_*'; branch 'master'}
        }
        steps{
            script{
                echo 'Docker Deliver to Artifact Registry stage'
                 sh "docker tag reverse-angular ${REGISTRY_LOCATION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY}/reverse-angular"
                 sh "docker push ${REGISTRY_LOCATION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY}/reverse-angular"
                }
        }
    }
    stage('Wait for approval') {
        when {
            anyOf {branch 'ft_*'; branch 'master'}
        }
        steps {
            script {
            try {
                timeout(time: 20, unit: 'MINUTES') {
                    approved = input message: 'Deploy to production?', ok: 'Continue',
                        parameters: [choice(name: 'approved', choices: 'Yes\nNo', description: 'Deploy build to production')]

                    if(approved != 'Yes') {
                        error('Build did not pass approval')
                    }
                }
            } catch(error) {
                error('Build failed because timeout was exceeded');
            }
        }
        }
    }
    stage('Deploy') {
        when {
            // branch 'master'
            // branch 'ft_jenkins'
            branch 'ft_*'
        }
        steps {
            echo 'Deploy stage'
            // sh 'sed -i "s/%TAG%/$BUILD_NUMBER/g" ./k8s/recipe-api.deployment.yaml'  // TO UPDATE
            // step([$class: 'KubernetesEngineBuilder',
            //     projectId: 'project2-350217',  // TO UPDATE
            //     clusterName: 'my-first-cluster-1', // TO UPDATE
            //     zone: 'us-central1-c', // TO CONFIRM
            //     manifestPattern: 'k8s/', // TO CONFIRM
            //     credentialsId: 'project2', // TO UPDATE
            //     verifyDeployments: true
            // ])

            // cleanWs();
        }
    }
  }
}
