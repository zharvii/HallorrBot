const Telegraf = require("telegraf");
const session = require("telegraf/session");
const Stage = require("telegraf/stage");
const { TELEGRAM } = require("./config");
const { getDateNow } = require("./Function/Date");
const { welcomeMessage, pendaftaranMessage } = require("./Library/Message");
const { mainMenuButton, pendaftaranButton } = require("./Library/Button");
const pasienBaruWizard = require("./Wizard/Pendaftaran/Baru");
const pasienLamaWizard = require("./Wizard/Pendaftaran/Lama");

const bMainMenu = mainMenuButton();
const bPendaftaran = pendaftaranButton();

const bot = new Telegraf(TELEGRAM.Token);
bot.use(session());

bot.telegram.getMe().then((bot_informations) => {
  bot.options.username = bot_informations.username;
  console.log(bot_informations.username + " Ready");
});

bot.use((ctx, next) => {
  if (ctx.message && typeof ctx.message.text !== "undefined") {
    ctx.message.text = ctx.message.text.toLowerCase();
  }

  try {
    const type = ctx.updateType;
    const subTypes =
      ctx.updateSubTypes.length == 0 ? "Action" : ctx.updateSubTypes[0];
    const dateTime = getDateNow(true, "-");
    const chat_from = `(UserID: ${ctx.from.id}) (Username : ${ctx.from.username})`;
    console.log(
      `Chat from ${chat_from} (Type : ${type}) (SubType : ${subTypes}) (Response Time: ${dateTime})`
    );
  } catch (e) {
    console.log(e);
  }

  return next(ctx);
});

const stage = new Stage([pasienBaruWizard, pasienLamaWizard]);
bot.use(stage.middleware());

bot.start((ctx) => {
  let msg = welcomeMessage(ctx);
  bot.telegram.sendMessage(ctx.chat.id, msg, bMainMenu);
});

bot.command("halorr", (ctx) => {
  let msg = welcomeMessage(ctx);
  bot.telegram.sendMessage(ctx.chat.id, msg, bMainMenu);
});

bot.action("m1", async (ctx) => {
  let msg = pendaftaranMessage();
  bot.telegram.editMessageText(
    ctx.chat.id,
    ctx.update.callback_query.message.message_id,
    null,
    msg,
    bPendaftaran
  );
});

bot.action("m2", async (ctx) => {
  let msg = "Coming Soon";
  bot.telegram.sendMessage(ctx.chat.id, msg);
});

bot.action("back", async (ctx) => {
  let msg = welcomeMessage(ctx);
  bot.telegram.editMessageText(
    ctx.chat.id,
    ctx.update.callback_query.message.message_id,
    null,
    msg,
    bMainMenu
  );
});

bot.action("old", async (ctx) => {
  let msg = "<b>Silahkan Isi Form Berikut</b>";
  await ctx.replyWithHTML(msg);
  ctx.scene.enter("pasien-lama");
});

bot.action("new", async (ctx) => {
  ctx.deleteMessage();
  let msg = "<b>Silahkan Isi Form Berikut</b>";
  await ctx.replyWithHTML(msg);
  ctx.scene.enter("pasien-baru");
});

bot.launch();

bot.catch(async (err, ctx) => {
  console.log("Ooops", err);
  await ctx.reply("Mohon Maaf Bot Error");
});
