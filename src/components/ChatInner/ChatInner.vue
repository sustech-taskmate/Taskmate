<template>
    <div class="chat vac-app-box-shadow">
        <el-row style="width: 100%;" :style="{ height: topHeight }">
            <chat-inner-messages :messages="messages" :myId="id"/>
        </el-row>
        <el-row class="footer" :style="{ height: downHeight }">
            <chat-inner-footer @change-size="updateHeight" @send-message="sendMessage"/>
        </el-row>
    </div>
</template>

<script lang="ts">
import {defineComponent, watch} from 'vue';
import {ref} from "vue";
import {ChatMessage} from "@/store/chat";
import ChatInnerFooter from "@/components/ChatInner/ChatInnerFooter.vue";
import ChatInnerMessages from "@/components/ChatInner/ChatInnerMessages.vue";
import {EntryResponse, EntryProblemResponseData, sendNote, Note} from "@/composable/serverRequest";
import {getEntry} from "@/composable/serverRequest";
import {assert} from '@vueuse/core';
import {useRoute} from "vue-router";

export default defineComponent({
    name: "ChatInner",
    components: {ChatInnerMessages, ChatInnerFooter},
    props: {
        cid: {
            type: String,
            require: true,
            default: '',
        },
        eid: {
            type: String,
            require: true,
            default: '',
        }
    },
    setup(props) {
        const route = useRoute();
        let topHeight = ref('89%')
        let downHeight = ref('10%')

        let messages = ref<ChatMessage[]>([])
        const {cid, eid} = props;

        const period = () => {
            messages.value.slice(0, 0)
            let allNotes = [] as ChatMessage[]
            getEntry(cid, eid).then((item) => {
                let temp = item.entry
                for (const no of temp.notes) {
                    const mes = new ChatMessage(no.text, new Date(no.submittedAt * 1000), no.submitter.name,
                        no.submitter.sid, '', [])
                    allNotes.push(mes)
                }
            }).then(() =>{
                messages.value = allNotes.sort((a, b)=>{
                    return a.time.getTime() - b.time.getTime()
                })
            })
        }

        setInterval(period, 1000)

        const sendMessage = (msg: ChatMessage) => {
            console.log(msg)
            sendNote(cid, eid, msg.text)
        }

        const id = ref(route.query.sid as string)

        const updateHeight = (flag: boolean) => {
            if (flag) {
                topHeight.value = '60%'
                downHeight.value = '39%'
            } else {
                topHeight.value = '89%'
                downHeight.value = '10%'
            }
        }

        return {
            topHeight, downHeight, messages, updateHeight, sendMessage, id
        }

    },

})
</script>

<style>
.chat {
    display: flex;
    width: 100%;
    height: 90%;
    background-color: #F5F5F5;
    box-sizing: border-box;
    flex-direction: column;
}

.footer {
    width: 100%;
    border-top: #E6E6FA;
    border-top-style: solid;
    border-top-width: thin
}

</style>
