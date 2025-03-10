provider "aws" {
    region = "ap-southeast-1"
}

resource "aws_instance" "app_server" {
  ami           = "ami-0df7a207adb9748c7"
  instance_type = "t2.micro"

  tags = {
    Name = "Frontend-Test-Server"
  }

  vpc_security_group_ids = [aws_security_group.allow_http.id]

  user_data = <<-EOF
              #!/bin/bash
              sudo yum update -y
              sudo yum install -y nodejs npm
              sudo npm install -g pm2
              git clone https://github.com/alitonia/frontend-test.git
              cd frontend-test
              npm install
              npm run build
              pm2 start npm --name "frontend-test" -- start
              EOF
}

resource "aws_security_group" "allow_http" {
  name        = "allow_http"
  description = "Allow HTTP inbound traffic"

  ingress {
    description = "HTTP from VPC"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "SSH from VPC"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "allow_http"
  }
}

output "public_ip" {
  value = aws_instance.app_server.public_ip
}