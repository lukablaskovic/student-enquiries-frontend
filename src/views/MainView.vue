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
  }),
  methods: {
    sendInquiry() {
      let data = {
        text: this.inquiry,
      };
      NLP.sendInquiry(data);
    },
  },
};
</script>
