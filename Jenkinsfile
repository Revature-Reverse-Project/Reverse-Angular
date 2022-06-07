pipeline {
  environment {
    registry = '' // TO UPDATE - Using Google Artifact Registry API
    dockerHubCreds = 'docker_hub' // TO CHANGE - Using Google Artifact Registry API
    dockerImage = '' // TO UPDATE - Using Google Artifact Registry API
    REGISTRY_LOCATION = 'us-central1'
    REPOSITORY = 'project-3'
    PROJECT_ID = 'devopssre-346918'
    CLUSTER_NAME = 'autopilot-cluster-1'
    scannerHome = tool 'SonarQubeScanner'
    PROJECT_KEY = 'reverse-angular'
    ORGANIZATION = 'revature-reverse-project'
  }
  agent any
  stages {
    // stage('Install') {
    //     when {
    //         anyOf {branch 'ft_*'; branch 'bg_*'; branch 'master'}
    //     }
    //     steps {
    //         echo 'Install stage'
    //         sh 'npm install --force'
    //     }
    // }
    stage('Code Analysis') {
      steps {
        withSonarQubeEnv('SonarCloud') {
          sh "${scannerHome}/bin/sonar-scanner -Dsonar.projectKey=${PROJECT_KEY} -Dsonar.organization=${ORGANIZATION}"
        }
      }
    }
    stage('Unit Testing') {
        when {
            anyOf {branch 'ft_*'; branch 'bg_*'}
        }
        steps {
            echo 'Unit Testing stage'
            // TO UPDATE - NOT MAVEN, TESTING?
            // withMaven {
            //     sh 'mvn test'
            // }
            // junit skipPublishingChecks: true, testResults: 'target/surefire-reports/*.xml'
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
    stage ('Deploy to GKE') {
        steps {
            sh "sed -i 's|image: reverse-angular|image: ${REGISTRY_LOCATION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY}/reverse-angular|g' Kubernetes/reverse-angular.deployment.yaml"
            step([$class: 'KubernetesEngineBuilder',
                projectId: env.PROJECT_ID,
                clusterName: env.CLUSTER_NAME,
                location: env.REGISTRY_LOCATION,
                manifestPattern: 'Kubernetes',
                credentialsId: env.CREDENTIALS_ID,
                verifyDeployments: true])
        }
    }
  }
}

