// worker.js
import { pipeline } from '@xenova/transformers';

class ImageQAPipeline {
    static model = 'Xenova/distilbert-base-cased-distilled-squad';
    static task = 'question-answering';
    static instance = null;

    static async getInstance(progress_callback = null) {
        if (this.instance === null) {
            this.instance = await pipeline(this.task, this.model, { progress_callback });
        }
        return this.instance;
    }
}

// Listen for messages from the main thread
self.onmessage = async (event) => {
    const { type, question, context } = event.data;

    if (type === 'ask') {
        const qa = await ImageQAPipeline.getInstance();

        try {
            const response = await qa(question, context);
            self.postMessage({ status: 'complete', response: response.answer });
        } catch (error) {
            console.error(error);
        }
    }
};
