<template>
    <div id="musicsManage">
        <img src="../../../../public/1.jpg" />
        <input type="file" name="file" id="myFile" ref="myFile">
        <button @click="uploadBTN">上传</button>
    </div>
</template>
<script>
    import SparkMD5 from'spark-md5'
    import axios from 'axios'
    var reader = new FileReader();
    // 基础数据的设置
    var baseURL = "http://localhost:3000/";
    //文件对象
    var file = null;
    //获取文件的总大小
    var fileSize = 0;
    //每次分块的大小 为1M
    var chunkSize = 1*1024;
    // 获取当前块 从哪里开始截取
    var currentChunk = 0;
    //总的块数
    var chunks = 0;

    var uploaded = 0;
    export default {
        data(){
            return {

            }
        },
        computed:{

        },
        methods:{
            blobSlice(blob,startByte,endByte){

                var rs =null;
                if(blob.slice){
                    rs = blob.slice(startByte,endByte)
                }
                if(blob.mozSlice){
                    rs = blob.mozSlice(startByte,endByte);
                }
                if(blob.webkitSlice){
                    rs = blob.webkitSlice(startByte,endByte)
                }
                reader.readAsArrayBuffer(rs);
                return rs;

            },
            md5File(){
                return new Promise((resolve,reject)=>{
                    var spark = new SparkMD5.ArrayBuffer();
                    reader.onload = (ev)=>{
                        var ev = ev || window.event;
                        spark.append(ev.target.result);
                        currentChunk++;
                        if((currentChunk*chunkSize) < fileSize){
                            this.blobSlice(file,currentChunk*chunkSize,(currentChunk+1)*chunkSize)
                        }else{
                            resolve(spark.end())
                        }
                    };
                    this.blobSlice(file,currentChunk*chunkSize,(currentChunk+1)*chunkSize)
                })
            },
            async startToUpload(){
                var md5Code = await this.md5File();
                console.log("加密后的代码",md5Code);
                //判断服务器里是否有相同的文件
                var rs = await this.checkFile(file.name,md5Code);
                console.log("文件是否存在.",rs);
                // 如果在服务器中,文件已经存在,则直接提示用户,秒传成功.感觉很吊的样子
                if(rs.file){
                    alert("秒传成功");
                    return false;
                }
                /*
                    如果找不到对应的文件,则表示该文件没有被上传,或者是没有完全上传成功,
                    导致没有进行合并操作,
                */
                var chunkList = rs.data.chunkList;

                this.checkChunkAndUpload(md5Code,chunkList)
            },
            uploadBTN(){
                var myfile = this.$refs.myFile;
                console.log("myfile",myfile.files[0])
                file=myfile.files[0];
                // 文件的大小
                fileSize = file.size;
                //获取总的块数
                chunks = fileSize/chunkSize;
                if(chunks<1){
                    chunks=1;
                }
                this.startToUpload();
            },
            checkFile(filename,md5Code){
                var checkFileURL = `${baseURL}music/checkFile?fileName=${filename}&fileMd5Value=${md5Code}`
                return axios.get(checkFileURL)
            },
            async checkChunkAndUpload(md5Code,chunkList){

                uploaded = chunkList.length;

                for(var i=0;i<=chunks-1;i++){
                    //判断块是否存在
                    var chunkExist = chunkList.indexOf(i+"")>-1;
                    if(!chunkExist){
                        //如果不存在,则对该块进行上传
                        var n = await this.uploadChunk(i,md5Code,chunks);
                        uploaded++;
                        // 获取当前上传的百分比
                        var precent = Math.floor((uploaded/chunks)*100)+"%";
                        console.log("当前上传的进度为",precent);
                    }
                }
            },
            uploadChunk(i,md5Code,chunks){
                // 1 2*chunkSize 3*chunSzie
                // 加入结束位置的大小超过文件的大小,则表示这是最后一块分块
                // 如果小于,则表示还有至少2块
                var end = (i+1)*chunkSize>fileSize?fileSize:(i+1)*chunkSize;
                // blobSlice(file,i*chunkSize,end)
                var formData = new FormData();
                formData.append("data",this.blobSlice(file,i*chunkSize,end));
                formData.append("totalChunks",chunks);
                formData.append("fileMd5Value",md5Code);
                formData.append("currChunk",i);
                formData.append("filename",file.name);
                //上传音频的地址
                var uploadUrl = `${baseURL}music/uploadMusic`;
                console.log("url",uploadUrl)
                console.log(formData)
                for (var value of formData.values()) {
                    console.log(value);
                }
                return axios.post(uploadUrl,formData)
            }
        }
    }
</script>
<style scoped>

</style>