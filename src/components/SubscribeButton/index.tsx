import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { api } from "../../services/api";
import { getStripeJs } from "../../services/stripe-js";
import styles from "./styles.module.scss";

export function SubscribeButton() {
  const {data: session, status}= useSession();
  const router = useRouter();

  async function handleSubscribe() {
    if(!session) {
      signIn('github')
      return;
    }

    if(status) {
      router.push('/posts');
      return;
    }
    
    try {
      const response = await api.post('/subscribe')

      const { sessionId } = response.data;

      const stripe = await getStripeJs();

      stripe.redirectToCheckout({ sessionId });
    } catch(err) {
      console.log(err);
    }

  }

  return (
    <button type="button" className={styles.subscribeButton} onClick={handleSubscribe}>
      Subscribe now
    </button>
  );
}
