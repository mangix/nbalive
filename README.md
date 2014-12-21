# nbalive


NBA live in terminal.

![rect](https://github.com/mangix/nbalive/blob/master/img/list.png)
![rect](https://github.com/mangix/nbalive/blob/master/img/live.png)
![rect](https://github.com/mangix/nbalive/blob/master/img/statistic.png)

## Installation

先安装[Node.js](http://nodejs.org/download/) ,然后

	$ npm install -g nbalive
	
## Usage
```bash
   Usage: nbalive [options]

   Options:

        -h, --help         output usage information
        -V, --version      output the version number
        -d, --date [date]  choose date
        -r, --rank         show rank list
```

	$ nbalive  //当天赛程
	$ nbalive -d 2014-12-01 //指定某天赛程
	$ nbalive -r //查看排名
	$ nbalive --help //查看帮助
