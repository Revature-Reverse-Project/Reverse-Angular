pipeline {
  environment {
    registry = '' // TO UPDATE - Using Google Artifact Registry API
    dockerHubCreds = 'docker_hub' // TO CHANGE - Using Google Artifact Registry API
    dockerImage = '' // TO UPDATE - Using Google Artifact Registry API
  }
  agent any
  stages {
      stage ('Angular - Sonar Scanner'){
          steps {
              withSonarQubeEnv('sonarqube-p3-test') {
                  //Run sonar-scanner cli docker image and check with sonar plugin
                  sh "cd Reverse-Angular; docker run \
                  --rm \
                  -v `pwd`:/usr/src \
                  sonarsource/sonar-scanner-cli \
                  sonar-scanner \
                  -Dsonar.host.url=${SONAR_HOST_URL} \
                  -Dsonar.login=${SONAR_AUTH_TOKEN} \
                  -Dsonar.projectKey=${SONAR_ANGULAR_PROJECT_KEY} \
                  -Dsonar.scm.exclusions.disabled=true \
                  -Dsonar.scm.disabled=True"
              }
          }
      }
      stage("Angular - Quality Gate") {
          steps {
              timeout(time: 1, unit: 'HOURS') {
                  waitForQualityGate abortPipeline: true, webhookSecretId: 'sonar-angular-webhook'
              }
          }
      }
    stage('Install') {
        when {
            anyOf {branch 'ft_*'; branch 'bg_*'; branch 'master'}
        }
        steps {
            echo 'Install stage'
            sh 'npm install'
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
            // branch 'master'
            // branch 'ft_jenkins'
            branch 'ft_*'
        }
        steps{
            script {
                echo 'Docker Image stage'
                // echo "$registry:$currentBuild.number"
                // dockerImage = docker.build "$registry:$currentBuild.number"
            }
        }
    }
    stage('Docker Deliver to Artifact Registry') {
        when {
            // branch 'master'
            // branch 'ft_jenkins'
            branch 'ft_*'
        }
        steps{
            script{
                echo 'Docker Deliver to Artifact Registry stage'
                // docker.withRegistry("", dockerHubCreds) {
                //     dockerImage.push("$currentBuild.number")
                //     dockerImage.push("latest")
                }
        }
    }
    stage('Wait for approval') {
        when {
            // branch 'master'
            // branch 'ft_jenkins'
            branch 'ft_*'
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
