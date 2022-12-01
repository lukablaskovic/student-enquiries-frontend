<template>
  <v-container>
    <v-row class="text-center">
      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3 text-gray-700">
          Student enquiries classificator
        </h1>

        <v-container class="max-w-md">
          <v-textarea
            v-model="inquiry"
            name="input-7-1"
            label="Unesite vaš upit ovdje"
            hint="Pitanje postavite na Hrvatskom jeziku"
            append-icon="mdi-message-question"
            auto-grow>
          </v-textarea>
        </v-container>
        <v-tooltip bottom v-if="!request">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="mx-2"
              fab
              dark
              small
              color="primary"
              @click="sendInquiry"
              v-bind="attrs"
              v-on="on">
              <v-icon dark> mdi-email-arrow-right </v-icon>
            </v-btn>
          </template>
          <span>Pošalji upit</span>
        </v-tooltip>
        <v-progress-circular
          v-if="request"
          indeterminate
          color="primary"></v-progress-circular>

        <v-container class="w-1/2 mt-6 max-w-md">
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
                  <td>
                    <v-chip :color="topic.color">
                      {{ topic.similarity }}
                    </v-chip>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-container>
      </v-col>
    </v-row>

    <v-row>
      <v-footer class="mb-1" color="white" padless bottom absolute>
        <v-row justify="center" no-gutters>
          <v-img
            max-height="350"
            max-width="400"
            :src="require('@/assets/fipu_hr.png')">
          </v-img>
        </v-row>
      </v-footer>
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
    request: false,
  }),

  methods: {
    async sendInquiry() {
      this.request = true;
      this.topics = [];
      let data = {
        text: this.inquiry,
      };
      let result = await NLP.sendInquiry(data);

      let sorted_data = this.sortBySimilarity(result);
      let final_data = this.setColors(sorted_data);

      this.topics = final_data;

      this.request = false;
      console.log(this.topics);
    },
    sortBySimilarity(unsorted_data) {
      let sorted_data = unsorted_data.data.sort((a, b) =>
        a.similarity > b.similarity ? -1 : 1
      );
      return sorted_data;
    },
    setColors(sorted_data) {
      sorted_data[0].color = "green";
      sorted_data[1].color = "orange";
      sorted_data[2].color = "red";
      sorted_data[3].color = "red";

      return sorted_data;
    },
  },
};
</script>
