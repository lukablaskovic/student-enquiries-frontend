<template>
  <v-container>
    <v-row class="text-center">
      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">
          Student enquiries classificator
        </h1>
        <v-textarea
          v-model="inquiry"
          name="input-7-1"
          label="Unesite vaš upit ovdje"
          hint="Pitanje postavite na Hrvatskom jeziku"
        ></v-textarea>

        <v-btn class="mx-2" fab dark small color="primary" @click="sendInquiry">
          <v-icon dark> mdi-email-arrow-right </v-icon>
        </v-btn>
        <v-container class="w-1/2 mt-6">
          <v-simple-table dense fixed-header>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">Topic</th>
                  <th class="text-left">Similarity</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="topic in topics" :key="topic.name">
                  <td>{{ topic.topic }}</td>
                  <td>{{ topic.similarity }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import NLP from "@/services/index";
export default {
  name: "Main",

  data: () => ({
    inquiry: "",
    topics: [],
  }),
  methods: {
    async sendInquiry() {
      let data = {
        text: this.inquiry,
      };
      let result = await NLP.sendInquiry(data);
      this.topics = result.data;
      console.log(result.data);
    },
  },
};
</script>
