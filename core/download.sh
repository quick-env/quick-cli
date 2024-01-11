#!/bin/bash

git_modules=("" "")

for(( i = 0; i < ${#git_modules[@]}; i++ )) do {
  git clone "git地址/"${git_modules[i]}""
} & done;

wait

echo "git 模块下载完成!!!"

sleep 30