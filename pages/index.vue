<template>
	<div class="w-full h-dvh overflow-hidden box-border">
		<div class="w-full h-dvh overflow-hidden box-border flex flex-col">
			<div class="max-w-[30em] w-full h-12 text-white p-2 bg-slate-900 flex items-center justify-between
			box-border overflow-hidden shrink-0">
        <div class="h-full flex items-center">
          <Pressable class="size-4 mr-4">
            <img src="@/assets/images/back.svg" class="invert"/>
          </Pressable>
					<Pressable class="size-8 mr-4">
						<div class="size-8 rounded-full bg-green-400 flex items-center justify-center">
							<img src="@/assets/images/smile.svg" class="size-4"/>
						</div>
					</Pressable>
          <p>{{ sister }}</p>
        </div>
        <div class="h-full flex items-center">
          <Pressable class="size-4">
            <img src="@/assets/images/menu.svg" class="invert"/>
          </Pressable>
        </div>
      </div>
      <div class="max-w-[30em] overflow-scroll p-2 w-full relative flex-1" id="scrollable-container">
				<div v-for="(chat, chat_i) in convo" class="w-full relative">
					<div v-for="(bubble, bubble_i) in chat.parts" class="py-2 px-4 max-w-[80%] mt-2 rounded-lg w-fit"
					:class="[chat.role == 'user' ? 'bg-green-900' : 'bg-zinc-600', chat.role == 'user' ? 'ml-auto' : 'mr-auto']"
					:id="`c_${chat_i}_${bubble_i}`">
						<span class="text-white" v-html="renderMarkdownInline(bubble.text)"></span>
					</div>
				</div>
			</div>
			<div class="max-w-[30em] w-full h-14 flex flex-col text-white flex items-center justify-between
			box-border overflow-hidden shrink-0">
        <div class="w-full h-12 box-border p-2 flex items-center mb-1">
					<div class="grow h-10 rounded-full w-5/6 bg-slate-600 px-4 mr-2 box-border overflow-hidden flex items-center">
						<div class="grow h-8 w-full bg-slate-600 box-border overflow-hidden flex items-center">
							<textarea class="h-6 w-full bg-slate-600 resize-none focus:outline-none"
							placeholder="Enter message" v-model="user_message" @keyup.enter="send"></textarea>
						</div>
					</div>
					<Pressable class="size-10" @click="send">
						<div class="size-10 rounded-full bg-green-400 flex items-center justify-center">
							<img src="@/assets/images/plane.svg" class="size-4"/>
						</div>
					</Pressable>
				</div>
      </div>
		</div>
	</div>

</template>

<script setup>
const sister = ref('Ate')

const user_message = ref('')

const convo = ref([
	{
    role: "model",
    parts: [{ text: "Something on your mind?" }],
  }
])

function scrollToLatestDiv(divId) {
	const scrollableContainer = document.getElementById('scrollable-container');
	setTimeout(() => {
		const latestBubble = scrollableContainer.querySelector(`#${divId}`);
		if (latestBubble) {
			latestBubble.scrollIntoView({ behavior: 'smooth' });
		}
	}, 50)
}

async function send() {
	const message = user_message.value.trim()
	if (message.length == 0) {
		return
	}

	const chat_history = convo.value.map(entry => {
		return {
			role: entry.role,
			parts: entry.parts
		}
	})
	chat_history.unshift({
		role: "user",
    parts: [{ text: "Hello" }],
	})
	chat_history.unshift({
		role: "model",
    parts: [{ text: "What's up?" }],
	})

	setTimeout(() => {
		convo.value.push({
			role: "user",
			parts: [{ text: message }],
		})
		user_message.value = ''
		scrollToLatestDiv(`c_${convo.value.length-1}_${convo.value[convo.value.length-1].parts.length-1}`)
	}, 50)

	// const result = await chat.sendMessage({ message });
	const response = await $fetch('/api/geminichat', {
		method: 'POST',
		body: {
			message: message,
			history: chat_history // Send the full conversation history
		}
	});
	const bot_response = response.text.split('\n')
	const parts = []
	for (let i = 0; i < bot_response.length; i++) {
		const part = bot_response[i].trim()
		if (part.length == 0) {
			continue
		}
		parts.push({text: part})
	}
	convo.value.push({
		role: "model",
		parts: parts
	})

	scrollToLatestDiv(`c_${convo.value.length-1}_${convo.value[convo.value.length-1].parts.length-1}`)
}


function escapeHtml(str) {
	if (str == null) return ''
	return String(str)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;')
}

function renderMarkdownInline(text) {
	const escaped = escapeHtml(text)
	return escaped.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
}




</script>